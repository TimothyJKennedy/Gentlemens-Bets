'use client'

import { useEffect } from 'react'
import { useNotifications } from '../contexts/notifications-context'
import { formatDistanceToNow } from 'date-fns'
import { 
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
import type { Notification, NotificationType } from '../components/notifications/types'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { RefreshIndicator } from '../components/refresh-indicator'

const NotificationItem = ({ 
  notification, 
  onView, 
  onClick 
}: { 
  notification: Notification
  onView: (id: string) => void
  onClick: (notification: Notification) => void 
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView && !notification.read) {
      onView(notification.id)
    }
  }, [inView, notification.id, notification.read, onView])

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

  return (
    <div
      ref={ref}
      onClick={() => onClick(notification)}
      className={`
        p-4 rounded-lg cursor-pointer transition-colors duration-200
        ${notification.read 
          ? 'bg-card hover:bg-accent/50' 
          : 'bg-accent/20 hover:bg-accent/30 border-l-4 border-primary'}
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon(notification.type)}
        <div className="flex-1">
          <p className={`text-sm ${!notification.read && 'font-medium'}`}>
            {notification.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const { notifications, markAsRead, refreshNotifications } = useNotifications()
  const router = useRouter()
  
  const { isPulling, isRefreshing, pullProgress, error } = usePullToRefresh(async () => {
    await refreshNotifications()
  })

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
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
    }
  }

  // Sort notifications: unread first, then by timestamp
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return (
    <div className="relative">
      <RefreshIndicator
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullProgress={pullProgress}
        error={error}
      />
      
      <div className="container max-w-2xl mx-auto p-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="text-sm text-muted-foreground">
            {notifications.filter(n => !n.read).length} unread
          </div>
        </div>

        <div className="space-y-2">
          {sortedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onView={markAsRead}
              onClick={handleNotificationClick}
            />
          ))}
          {notifications.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No notifications yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

