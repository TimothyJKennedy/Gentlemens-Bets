'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bell, PlusSquare, User, Handshake } from 'lucide-react'
import { useNotifications } from '../contexts/notifications-context'

export function BottomNav() {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t h-16">
      <div className="container h-full max-w-lg mx-auto px-4">
        <div className="grid h-full grid-cols-5 items-center justify-items-center">
          <Link
            href="/"
            className={pathname === '/' ? 'text-foreground' : 'text-muted-foreground'}
          >
            <Home className="h-6 w-6" />
          </Link>
          
          <Link
            href="/bets"
            className={pathname === '/bets' ? 'text-foreground' : 'text-muted-foreground'}
          >
            <Handshake className="h-6 w-6" />
          </Link>

          <Link
            href="/create"
            className={pathname === '/create' ? 'text-foreground' : 'text-muted-foreground'}
          >
            <PlusSquare className="h-6 w-6" />
          </Link>

          <Link
            href="/notifications"
            className="relative"
          >
            <Bell className={`h-6 w-6 ${
              pathname === '/notifications' ? 'text-foreground' : 'text-muted-foreground'
            }`} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className={pathname === '/profile' ? 'text-foreground' : 'text-muted-foreground'}
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </nav>
  )
} 