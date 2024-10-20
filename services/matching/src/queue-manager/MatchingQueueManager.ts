import { Job, Queue, QueueEvents } from 'bullmq'
import Matcher from '../worker/Matcher'
import {
  DIFFICULTY_LEVELS,
  UserMatchDoneData,
  UserMatchingData,
  UserTicket,
} from '@common/shared-types'
import { redisConfig } from '../constants/redis'

export type MatchingQueueManagerOptions = {
  onMatchFound?: (data: UserMatchDoneData) => void
}

/**
 * Manages the queues and workers for the matching service.
 */
export default class MatchingQueueManager {
  private readonly _queues: Map<
    string,
    Record<UserMatchingData['difficulty'], Queue<UserTicket, UserMatchDoneData | null>>
  > = new Map()
  private readonly _workers = new Map<string, Matcher>()
  private readonly _queueEvents = new Map<string, QueueEvents>()

  private readonly _options: Required<MatchingQueueManagerOptions>

  constructor(options?: MatchingQueueManagerOptions) {
    this._options = {
      onMatchFound: () => {},
      ...(options || {}),
    }
  }

  /**
   * Adds new queues to the queue collection. If the queue already exists, it will be returned.
   *
   * @param topic The topic of the queue.
   * @param difficulty The difficulty of the queue.
   * @returns The queue that was added to the collection.
   */
  public addQueue(
    topic: UserMatchingData['topic'],
    difficulty: UserMatchingData['difficulty']
  ) {
    if (this._queues.has(topic)) {
      return this._queues.get(topic)![difficulty]
    }
    const queueRecord: Record<
      UserMatchingData['difficulty'],
      Queue<UserTicket, UserMatchDoneData | null>
    > = {} as Record<
      UserMatchingData['difficulty'],
      Queue<UserTicket, UserMatchDoneData | null>
    >
    for (const key of DIFFICULTY_LEVELS) {
      const queueName = this.getQueueName(topic, key)

      const queue = new Queue<UserTicket, UserMatchDoneData | null>(queueName, {
        connection: redisConfig,
      })

      const queueEvents = new QueueEvents(queueName, {
        connection: redisConfig,
      })
      queueEvents.on('completed', async ({ returnvalue }) => {
        if (returnvalue !== null) {
          // type casting since returnvalue is string for some reason
          this._options.onMatchFound(returnvalue as unknown as UserMatchDoneData)
        }
      })
      this._queueEvents.set(queueName, queueEvents)

      const matcher = new Matcher(queueName)
      this._workers.set(queueName, matcher)
      queueRecord[key] = queue
    }
    this._queues.set(topic, queueRecord)
    return this._queues.get(topic)![difficulty]
  }

  public getQueue(
    topic: UserMatchingData['topic'],
    difficulty: UserMatchingData['difficulty']
  ) {
    if (!this._queues.has(topic)) {
      return undefined
    }
    return this._queues.get(topic)![difficulty]
  }

  /**
   * Adds a new ticket as a job to the queue collection. If the queue does not exist, it will be created.
   * Queue name is generated based on the topic and difficulty of the ticket.
   *
   * @param ticket The ticket data to add to the queue.
   * @returns The job that was added to the queue.
   */
  public async addTicket(ticket: UserTicket) {
    let queue = this.getQueue(ticket.data.topic, ticket.data.difficulty)
    if (queue === undefined) {
      queue = this.addQueue(ticket.data.topic, ticket.data.difficulty)
    }
    const jobName = ticket.ticketId
    const job = await queue.add(jobName, ticket, {
      jobId: ticket.ticketId,
      deduplication: {
        id: ticket.data.userId,
        ttl: 5000, // cooldown in milliseconds, avoid spamming
      },
    })

    // TODO: Wake up the worker when total jobs in a topic queue is more than 1
    if ((await queue.count()) > 1) {
      this._workers.get(queue.name)!.runOrResume()
    }
    return job
  }

  /**
   * Removes a ticket from the queue.
   *
   * @param ticketId The ID of the ticket to remove.
   * @param topic The topic of the queue.
   * @param difficulty The difficulty of the queue.
   */
  public async removeTicket(
    ticketId: string,
    topic: string,
    difficulty: UserMatchingData['difficulty']
  ) {
    await this.removeJob(ticketId, topic, difficulty) // ticketId is the jobName
  }

  /**
   * Removes a job from the queue collection.
   *
   * @param jobName The name of the job to remove.
   * @param topic The topic of the queue.
   * @param difficulty The difficulty of the queue.
   */
  public async removeJob(
    jobName: string,
    topic: string,
    difficulty: UserMatchingData['difficulty']
  ) {
    const queue = this.getQueue(topic, difficulty)
    if (queue !== undefined) {
      const job = await queue.getJob(jobName)
      if (job !== undefined) {
        const matcher = this._workers.get(queue.name)!
        matcher.removeBufferedTicket(job.data.ticketId)
        await job.remove()
      }
    }
  }

  /**
   * Generates a queue name based on the topic and difficulty.
   *
   * @param topic The topic of the queue.
   * @param difficulty The difficulty of the queue.
   * @returns The generated queue name.
   */
  private getQueueName(
    topic: UserMatchingData['topic'],
    difficulty: UserMatchingData['difficulty']
  ) {
    return `${difficulty}_${topic}`
  }

  /**
   * Gets the number of jobs waiting in the queue for a given topic.
   * Each topic has multiple queues, one for each difficulty level.
   *
   * @param topic The topic to get the queue count for.
   * @returns The number of jobs waiting in the queue.
   *
   * @see {@link UserMatchingData}
   */
  private async getTopicQueueCount(topic: UserMatchingData['topic']) {
    let count = 0
    for (const difficulty of DIFFICULTY_LEVELS) {
      const queue = this.getQueue(topic, difficulty)
      if (queue !== undefined) {
        count += await queue.count()
      }
    }
    return count
  }
}
