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
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED'
  createdAt: Date
  updatedAt: Date
  creator: User
  opponent: User
  likes?: number
  comments?: number
  bookmarked?: boolean
}

export type BetStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED'
export type BetFilter = 'pending' | 'active' | 'completed' | 'all'