"use client"

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth/')

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme={isAuthPage ? 'light' : 'system'}
      enableSystem={!isAuthPage}
      forcedTheme={isAuthPage ? 'light' : undefined}
    >
      {children}
    </NextThemesProvider>
  )
} 