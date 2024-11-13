import { configEnv, getGoogleAIApiKey } from '@common/utils'
configEnv()

import cors from 'cors'
import express from 'express'
import logger from './utils/logger'

import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  LangChainAdapter,
} from '@copilotkit/runtime'
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { verifyUser } from './utils/verifyToken'

const port = process.env.PORT ? parseInt(process.env.PORT) : 3007

const app = express()

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
]

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro-latest',
  apiKey: getGoogleAIApiKey(),
  safetySettings,
})

const serviceAdapter = new LangChainAdapter({
  chainFn: async ({ messages, tools }) => {
    return model.stream(messages, { tools })
  },
})

const runtime = new CopilotRuntime()

app.use(
  cors({
    origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
  })
)

app.use('/', async (req, res) => {
  logger.info('Received request')
  const userToken = req.headers.authorization
  if (userToken === undefined || !userToken.startsWith('Bearer ')) {
    res.status(401).send()
    return
  }

  const verifyResponse = await verifyUser(userToken.split('Bearer ')[1])

  if (verifyResponse === null) {
    res.status(401).send()
    return
  }

  logger.info('Authenticated successfully')
  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: '/',
    runtime,
    serviceAdapter,
  })

  return handler(req, res)
})

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})
