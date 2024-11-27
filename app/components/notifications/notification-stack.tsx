'use client'

import { useNotifications } from '@/app/contexts/notifications-context'
import { NotificationToast } from '@/app/components/notifications/notification-toast'
import { AnimatePresence } from 'framer-motion'

export const NotificationStack = () => {
  const { notifications, markAsRead, clearNotification } = useNotifications()
  
  // Only show the most recent unread notification
  const activeNotification = notifications
    .filter(n => !n.read)[0]

  return (
    <div className="fixed top-14 left-0 right-0 z-50">
      <AnimatePresence mode="wait">
        {activeNotification && (
          <NotificationToast
            key={activeNotification.id}
            notification={activeNotification}
            onClose={clearNotification}
            onRead={markAsRead}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 