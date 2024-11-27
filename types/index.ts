export interface User {
  id: string
  username: string
  profileImage?: string
}

export interface Bet {
  id: string
  creatorId: string
  opponentId: string
  description: string
  deadline: Date
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLATION_REQUESTED'
  createdAt: Date
  updatedAt: Date
  creator: User
  opponent: User
  likes?: number
  comments?: number
  bookmarked?: boolean
  cancellationRequestedBy?: string
}

export enum BetStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLATION_REQUESTED = 'CANCELLATION_REQUESTED'
}

export type BetFilter = 'pending' | 'active' | 'completed' | 'all'