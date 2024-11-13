import { Job, Worker } from 'bullmq'
import logger from '../utils/logger'
import { redisConfig } from '../constants/redis'
import { UserMatchDoneData, UserTicket } from '@common/shared-types'

export default class Matcher {
  private _worker: Worker
  private _buffer: UserTicket[] = []
  private readonly _bufferSize = 1

  constructor(queueName: string) {
    this._worker = new Worker<UserTicket, UserMatchDoneData | null>(
      queueName,
      this.processor.bind(this),
      {
        autorun: false,
        connection: redisConfig,
        concurrency: 1,
      }
    )
    this._worker.on('error', (error) => {
      logger.error(`Error processing job: ${error}`)
    })
  }

  runOrResume() {
    if (this._worker.isPaused()) {
      this._worker.resume()
    } else if (!this._worker.isRunning()) {
      this._worker.run()
    }
  }

  processor = async (job: Job<UserTicket, UserMatchDoneData | null, string>) => {
    let result: UserMatchDoneData | null = null
    if (this._buffer.length < this._bufferSize) {
      this._buffer.push(job.data)
    } else {
      // match the users
      this._buffer.push(job.data)
      result = {
        topic: job.data.data.topic,
        difficulty: job.data.data.difficulty,
        userIds: this._buffer.map((ticket) => ticket.data.userId),
        ticketIds: this._buffer.map((ticket) => ticket.ticketId),
      }
      this._buffer = []
    }
    return result
  }

  public removeBufferedTicket(ticketId: string) {
    this._buffer = this._buffer.filter((ticket) => ticket.ticketId !== ticketId)
  }
}
