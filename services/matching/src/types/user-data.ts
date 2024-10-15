export const DIFFCULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const

export type UserMatchingData = {
  userId: string
  difficulty: (typeof DIFFCULTY_LEVELS)[number]
  topic: string
}

export type UserTicket = {
  ticketId: string
  data: UserMatchingData
}

export type UserMatchDoneData = {
  topic: string
  difficulty: UserMatchingData['difficulty']
  userIds: string[]
  ticketIds: string[]
}
