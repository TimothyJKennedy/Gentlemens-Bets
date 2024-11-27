export type NotificationType = 
  | 'bet-request'
  | 'bet-accepted'
  | 'bet-rejected'
  | 'bet-deadline'
  | 'bet-dispute'
  | 'bet-resolved'
  | 'bet-cancel-request'
  | 'bet-cancelled'
  | 'comment'
  | 'like'
  | 'bookmark'
  | 'share'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  data?: {
    betId?: string
    userId?: string
    commentId?: string
  }
} 