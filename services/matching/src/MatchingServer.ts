import { UserMatchDoneData, UserMatchingData, UserTicket } from './types/user-data'
import MatchingQueueManager from './queue-manager/MatchingQueueManager'
import { Server as SocketIOServer, ServerOptions, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { MessageType } from './types/events'
import logger from './utils/logger'
import { getTicketId } from './utils/ticketid'

export default class MatchingServer {
  private readonly _matchingQueueManager: MatchingQueueManager
  private readonly _webSocketServer: SocketIOServer
  private readonly _clientSockets: Map<string, Socket> = new Map()

  constructor(httpServer: HttpServer, options?: ServerOptions) {
    this._matchingQueueManager = new MatchingQueueManager({
      onMatchFound: this.onMatchFound.bind(this),
    })
    this._webSocketServer = new SocketIOServer(httpServer, options)

    this._webSocketServer.on('connection', this.onConnection.bind(this))
  }

  private async onConnection(socket: Socket) {
    // TODO: Authenticate the user and save the socket object for future use

    socket.on(MessageType.MATCH_REQUEST, (data: UserMatchingData) =>
      this.onMatchingRequest(data, socket)
    )

    socket.on(MessageType.MATCH_CANCEL, (ticket: UserTicket) => {
      this.onMatchCancel(ticket, socket)
    })
  }

  private async onMatchingRequest(data: UserMatchingData, socket: Socket) {
    try {
      const ticket: UserTicket = {
        ticketId: getTicketId(data),
        data: data,
      }

      // TODO: Preliminary validation here: duplicate ticket, user in a match already, etc.

      const job = await this._matchingQueueManager.addTicket(ticket)

      // TODO: Move this to inside onConnection method
      this._clientSockets.set(ticket.data.userId, socket)

      socket.emit(MessageType.MATCH_REQUEST_QUEUED, ticket.ticketId)
    } catch (error) {
      logger.error(`Error processing matching request: ${error}`)
      if (error instanceof Error) {
        logger.error(error.stack)
      }
      socket.emit(MessageType.MATCH_REQUEST_FAILED)
    }
  }

  private async onMatchCancel(ticket: UserTicket, socket: Socket) {
    // TODO: Invalidate the ticket
    // If you are reading the database, you can fetch the data there and only use ticketId here.
    await this._matchingQueueManager.removeTicket(
      ticket.ticketId,
      ticket.data.topic,
      ticket.data.difficulty
    )
    socket.emit(MessageType.MATCH_CANCELLED, ticket.ticketId)
  }

  private async onMatchFound(data: UserMatchDoneData) {
    // TODO: Validation, db check if any
    // TODO: Do I need to fetch a question here?
    const sockets: Socket[] = []
    data.userIds.forEach((userId) => {
      const socket = this._clientSockets.get(userId)
      if (socket) {
        sockets.push(socket)
      }
    })
    if (sockets.length === data.userIds.length) {
      sockets.forEach((socket) => {
        socket.emit(MessageType.MATCH_FOUND, data)
      })
    } else {
      logger.error('Not all users found in the socket map')
      sockets.forEach((socket) => {
        socket.emit(MessageType.MATCH_REQUEST_FAILED)
      })
    }
  }
}
