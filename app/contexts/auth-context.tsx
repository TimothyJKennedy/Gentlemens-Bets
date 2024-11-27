'use client'

import { createContext, useContext } from 'react'
import { useAuth as useNextAuth, User } from '@/app/hooks/useAuth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useNextAuth()
  
  const value: AuthContextType = {
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    } : null,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 