import MatchingQueueManager from './queue-manager/MatchingQueueManager'
import { Server as SocketIOServer, ServerOptions, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import {
  MessageType,
  UserMatchDoneData,
  UserMatchingData,
  UserTicket,
  UserMatchingRequest,
} from '@common/shared-types'
import logger from './utils/logger'
import { verifyUser } from './utils/verifyToken'
import { createRoom } from './api/room'

type ClientRequests = {
  socket: Socket
  ticket: UserTicket
  timeout: NodeJS.Timeout
}

export default class MatchingServer {
  private readonly _matchingQueueManager: MatchingQueueManager
  private readonly _webSocketServer: SocketIOServer
  private readonly _clientRequestsById: Map<string, ClientRequests> = new Map()
  private readonly _MATCH_TIMEOUT_DURATION = 30000 // 30 seconds

  constructor(httpServer: HttpServer, options?: ServerOptions) {
    this._matchingQueueManager = new MatchingQueueManager({
      onMatchFound: this.onMatchFound.bind(this),
    })
    this._webSocketServer = new SocketIOServer(httpServer, options)

    this._webSocketServer.on('connection', this.onConnection.bind(this))
  }

  private async onConnection(socket: Socket) {
    const token = socket.handshake.auth.token as string
    if (!token) {
      socket.emit(MessageType.AUTHENTICATION_FAILED)
      return
    }
    const user = await verifyUser(token)
    if (!user) {
      socket.emit(MessageType.AUTHENTICATION_FAILED)
      return
    }
    const userId = user.id

    socket.on(MessageType.MATCH_REQUEST, (data: UserMatchingRequest) => {
      this.onMatchingRequest({ userId, ...data }, socket)
    })

    socket.on(MessageType.MATCH_CANCEL, () => {
      this.onMatchCancel(userId)
    })

    socket.on('disconnect', () => {
      this._clientRequestsById.delete(userId)
    })
  }

  private async onMatchingRequest(data: UserMatchingData, socket: Socket) {
    try {
      const ticket: UserTicket = {
        ticketId: `${data.userId}_${crypto.randomUUID()}`,
        data,
      }

      const isCurrentlyMatching = !!this._clientRequestsById.get(data.userId)

      if (isCurrentlyMatching) {
        socket.emit(MessageType.MATCH_REQUEST_FAILED)
        return
      }

      const timeout = setTimeout(() => {
        this.onMatchTimeout(data.userId)
      }, this._MATCH_TIMEOUT_DURATION)

      const job = await this._matchingQueueManager.addTicket(ticket)

      logger.info(`[MATCH REQUEST QUEUED]`)
      logger.info(`Job ID: ${job.id}`)
      logger.info(`Job Name: ${job.name}`)
      logger.info(`Job Data: ${JSON.stringify(job.data)}`)
      logger.info(`Status: ${job.failedReason ? 'Failed' : 'Completed'}`)
      logger.info(`Created At: ${job.timestamp}`)
      logger.info(`======================================================`)

      this._clientRequestsById.set(ticket.data.userId, { socket, ticket, timeout })

      socket.emit(MessageType.MATCH_REQUEST_QUEUED, ticket.ticketId)
    } catch (error) {
      logger.error(`Error processing matching request: ${error}`)
      if (error instanceof Error) {
        logger.error(error.stack)
      }
      socket.emit(MessageType.MATCH_REQUEST_FAILED)
    }
  }

  private async onMatchCancel(userId: string) {
    const clientRequest = this._clientRequestsById.get(userId)
    if (!clientRequest) return

    const { socket, ticket } = clientRequest

    // Remove request from state && queue
    await this._matchingQueueManager.removeTicket(
      ticket.ticketId,
      ticket.data.topic,
      ticket.data.difficulty
    )

    this._clientRequestsById.delete(userId)
    socket.emit(MessageType.MATCH_CANCELLED)
  }

  private async onMatchFound(data: UserMatchDoneData) {
    const clientRequests: ClientRequests[] = []
    data.userIds.forEach((userId) => {
      const request = this._clientRequestsById.get(userId)
      if (request) {
        clientRequests.push(request)
      }
    })

    try {
      if (clientRequests.length === data.userIds.length) {
        logger.info(`[MATCH REQUEST FOUND]`)
        logger.info(`Topic: ${data.topic}`)
        logger.info(`Difficulty: ${data.difficulty}`)

        // Get roomId, matched user data, selected question from collaboration server
        const roomTicket = await createRoom(data)

        logger.info('Room created successfully: ' + roomTicket?.id)

        clientRequests.forEach((request, index) => {
          logger.info(`User ${index + 1}: ${request.ticket.data.userId}`)
          request.socket.emit(MessageType.MATCH_FOUND, roomTicket)
        })
        logger.info(`======================================================`)
      } else {
        logger.error('Not all users found in the socket map')
        clientRequests.forEach((request) => {
          request.socket.emit(MessageType.MATCH_REQUEST_FAILED)
        })
      }
    } catch (error) {
      logger.error(`Error processing match found: ${error}`)
      if (error instanceof Error) {
        logger.error(error.stack)
      }

      clientRequests.forEach((request, index) => {
        request.socket.emit('Error processing match found')
      })
    }
  }

  private async onMatchTimeout(userId: string) {
    const clientRequest = this._clientRequestsById.get(userId)
    if (!clientRequest) return

    const { socket, ticket, timeout } = clientRequest

    // Clear the timeout (just in case it hasn't already been cleared)
    if (timeout) {
      clearTimeout(timeout)
    }

    // Remove request from state && queue
    await this._matchingQueueManager.removeTicket(
      ticket.ticketId,
      ticket.data.topic,
      ticket.data.difficulty
    )

    this._clientRequestsById.delete(userId)
    socket.emit(MessageType.MATCH_REQUEST_FAILED)
  }
}
