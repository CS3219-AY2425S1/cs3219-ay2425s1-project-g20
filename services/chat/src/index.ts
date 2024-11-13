import { configEnv } from '@common/utils'
configEnv()

import cors from 'cors'
import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import logger from './utils/logger'

const app = express()
const port = process.env.PORT || 3005

app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
  })
)

const server = app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
    methods: ["GET", "POST"],
    credentials: true // Enable credentials if needed
  },
})

const MESSAGES_BY_ROOM_ID: Record<string, { sender: string, message: string, timestamp: Date }[]> = {}

io.on('connection', (socket) => {
  logger.info('User connected:', socket.id)

  socket.on('join', (roomId) => {
    socket.join(roomId)
    logger.info(`User ${socket.id} joined room: ${roomId}`);
    if (!MESSAGES_BY_ROOM_ID[roomId]) {
      MESSAGES_BY_ROOM_ID[roomId] = []
    }
    socket.emit('messages', MESSAGES_BY_ROOM_ID[roomId])
  })

  socket.on('message', ({ roomId, message, sender }) => {
    const messageData = { sender, message, timestamp: new Date() }
    if (!MESSAGES_BY_ROOM_ID[roomId]) {
      MESSAGES_BY_ROOM_ID[roomId] = []
    }
    MESSAGES_BY_ROOM_ID[roomId].push(messageData)
    io.to(roomId).emit('message', messageData)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})