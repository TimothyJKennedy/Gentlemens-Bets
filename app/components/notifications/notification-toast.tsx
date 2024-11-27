'use client'

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { 
  X, 
  HandshakeIcon,
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Gavel,
  Ban,
  MessageSquare,
  Heart,
  Bookmark,
  Share2
} from 'lucide-react'
import type { Notification, NotificationType } from './types'

interface NotificationToastProps {
  notification: Notification
  onClose: (id: string) => void
  onRead: (id: string) => void
}

export const NotificationToast = ({ notification, onClose, onRead }: NotificationToastProps) => {
  const router = useRouter()

  const handleClick = () => {
    onRead(notification.id)
    
    if (!notification.data) return

    switch (notification.type) {
      case 'bet-request':
      case 'bet-accepted':
      case 'bet-rejected':
      case 'bet-deadline':
      case 'bet-dispute':
      case 'bet-resolved':
      case 'bet-cancel-request':
      case 'bet-cancelled':
        router.push(`/bets/${notification.data.betId}`)
        break
        
      case 'comment':
        router.push(`/bets/${notification.data.betId}?comment=${notification.data.commentId}`)
        break
        
      case 'like':
      case 'bookmark':
      case 'share':
        router.push(`/bets/${notification.data.betId}`)
        break
        
      default:
        console.log('Unknown notification type:', notification.type)
    }
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'bet-request':
        return <HandshakeIcon className="h-5 w-5 text-blue-500" />
      case 'bet-accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'bet-rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'bet-deadline':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'bet-dispute':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'bet-resolved':
        return <Gavel className="h-5 w-5 text-purple-500" />
      case 'bet-cancel-request':
        return <Ban className="h-5 w-5 text-gray-500" />
      case 'bet-cancelled':
        return <Ban className="h-5 w-5 text-red-500" />
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-blue-400" />
      case 'like':
        return <Heart className="h-5 w-5 text-pink-500" />
      case 'bookmark':
        return <Bookmark className="h-5 w-5 text-indigo-500" />
      case 'share':
        return <Share2 className="h-5 w-5 text-teal-500" />
    }
  }

  const getBorderColor = (type: NotificationType) => {
    switch (type) {
      case 'bet-request':
        return 'border-l-blue-500'
      case 'bet-accepted':
        return 'border-l-green-500'
      case 'bet-rejected':
        return 'border-l-red-500'
      case 'bet-deadline':
        return 'border-l-yellow-500'
      case 'bet-dispute':
        return 'border-l-orange-500'
      case 'bet-resolved':
        return 'border-l-purple-500'
      case 'bet-cancel-request':
        return 'border-l-gray-500'
      case 'bet-cancelled':
        return 'border-l-red-500'
      case 'comment':
        return 'border-l-blue-400'
      case 'like':
        return 'border-l-pink-500'
      case 'bookmark':
        return 'border-l-indigo-500'
      case 'share':
        return 'border-l-teal-500'
    }
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-full bg-background border-l-4 shadow-md ${getBorderColor(notification.type)} cursor-pointer hover:bg-accent/50`}
      onClick={handleClick}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{notification.title}</span>
              {" - "}
              <span className="text-muted-foreground">{notification.message}</span>
            </p>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose(notification.id)
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
} 