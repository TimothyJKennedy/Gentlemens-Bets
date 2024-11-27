export interface User {
  id: string
  username: string
  profileImage?: string
}

export interface Bet {
  id: string
  description: string
  deadline: Date
  status: string
  createdAt: Date
  creator: User
  opponent?: User
  likes?: number
  comments?: number
  bookmarked?: boolean
} 