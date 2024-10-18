import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}

import cors from 'cors'
import express from 'express'
import logger from './utils/logger'
import MatchingServer from './MatchingServer'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
  })
)

const server = app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})

const matchingServer = new MatchingServer(server)
