import { configEnv } from '@common/utils'
configEnv()

import cors from 'cors'
import express from 'express'
import { ServerOptions } from 'socket.io'
import MatchingServer from './MatchingServer'
import logger from './utils/logger'

const app = express()
const port = process.env.PORT || 3003

app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
  })
)

const server = app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})

const corsOptions = {
  cors: {
    origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
} as ServerOptions

const matchingServer = new MatchingServer(server, corsOptions)
