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
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

// Initialize Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

// Create a client
const queryClient = new QueryClient()

// Root layout component that wraps the entire application
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get current pathname to determine if we're on an auth page
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth/')
  const { setTheme } = useTheme()

  useEffect(() => { 
    if (isAuthPage) {
      setTheme('light')
    }
  }, [isAuthPage, setTheme])

  return (
    // HTML element with language and hydration warning suppression
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <AuthProvider>
                <BookmarksProvider>
                  <NotificationsProvider>
                    {/* Only show header if not on auth pages */}
                    {!isAuthPage && <Header />}
                    <NotificationStack />
                    {/* Main content area with optional padding */}
                    <main className={!isAuthPage ? "pb-16" : ""} suppressHydrationWarning>{children}</main>
                    {/* Only show bottom navigation if not on auth pages */}
                    {!isAuthPage && <BottomNav />}
                  </NotificationsProvider>
                </BookmarksProvider>
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SessionProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}

