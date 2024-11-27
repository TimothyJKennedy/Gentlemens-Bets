'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Notification } from '../components/notifications/types'

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  refreshNotifications: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const newSocket = io('http://localhost:3001')
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev])
    })

    return () => {
      socket.off('notification')
    }
  }, [socket])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const refreshNotifications = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Emit refresh event to socket
      if (!socket) {
        throw new Error('No socket connection')
      }
      
      socket.emit('refresh-notifications')
      
      // You could also fetch notifications directly here
      // const response = await fetch('/api/notifications')
      // const data = await response.json()
      // setNotifications(data)
    } catch (err) {
      // Rethrow the error to be handled by the pull-to-refresh hook
      throw new Error(err instanceof Error ? err.message : 'Failed to refresh notifications')
    }
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
} 