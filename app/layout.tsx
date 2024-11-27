'use client'

import './globals.css'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/app/components/theme-provider'
import { Header } from '@/app/components/header'
import { BottomNav } from '@/app/components/bottom-nav'
import { BookmarksProvider } from './contexts/bookmarks-context'
import { NotificationsProvider } from './contexts/notifications-context'
import { NotificationStack } from './components/notifications/notification-stack'
import { AuthProvider } from './contexts/auth-context'
import { Inter } from 'next/font/google'
import AuthSessionProvider from '@/app/providers/session-provider'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth/')
  const { setTheme } = useTheme()

  useEffect(() => {
    if (isAuthPage) {
      setTheme('light')
    }
  }, [isAuthPage, setTheme])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthSessionProvider>
          <ThemeProvider>
            <AuthProvider>
              <BookmarksProvider>
                <NotificationsProvider>
                  {!isAuthPage && <Header />}
                  <NotificationStack />
                  <main className={!isAuthPage ? "pb-16" : ""} suppressHydrationWarning>{children}</main>
                  {!isAuthPage && <BottomNav />}
                </NotificationsProvider>
              </BookmarksProvider>
            </AuthProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}

