"use client"

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// ThemeProvider component that wraps the entire application
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get current pathname to determine if we're on an auth page
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth/')

  return (
    <NextThemesProvider
      // Use class attribute to toggle themes
      attribute="class" 
      // Set default theme based on auth page status
      defaultTheme={isAuthPage ? 'light' : 'system'}
      // Enable system theme if not on auth page
      enableSystem={!isAuthPage}
      // Force light theme on auth pages
      forcedTheme={isAuthPage ? 'light' : undefined}
    >
      {children}
    </NextThemesProvider>
  )
} 