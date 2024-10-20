import { ConnectionOptions } from 'bullmq'

export const redisConfig: ConnectionOptions = {
  url: process.env.REDIS_URL,
}
