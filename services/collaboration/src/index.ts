import { configEnv } from '@common/utils'
configEnv()

import express from 'express'
import cors from 'cors'
import expressWebSockets from 'express-ws'
import createHocuspocusServer from './HocuspocusServer'
import roomRoutes from './routes/room-routes'
import logger from './utils/logger'

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

async function startServer() {
  // Hocuspocus server
  const hocuspocusServer = await createHocuspocusServer(port)

  // Room server
  const { app } = expressWebSockets(express())

  app.use(
    cors({
      origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
    })
  )

  app.use(express.json())

  app.use('/room', roomRoutes)

  app.ws('/', (websocket, request) => {
    hocuspocusServer.handleConnection(websocket, request)
  })

  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`)
  })
}

startServer()
