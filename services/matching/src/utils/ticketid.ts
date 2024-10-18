import { UserMatchingData } from '../types/user-data'

export function getTicketId(data: UserMatchingData): string {
  const uuid = crypto.randomUUID()
  return `${data.userId}_${uuid}`
}
