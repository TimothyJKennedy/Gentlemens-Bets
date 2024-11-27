'use client'

// Import necessary hooks and types
import { createContext, useContext } from 'react'
import { useAuth as useNextAuth, User } from '@/app/hooks/useAuth'

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null
  isLoading: boolean
}

// Create the authentication context with an undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component that supplies the authentication context to its children
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use the custom useAuth hook to get user and loading state
  const { user, isLoading } = useNextAuth()
  
  // Define the value to be provided by the context
  const value: AuthContextType = {
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    } : null,
    isLoading
  }

  // Return the context provider with the value
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to consume the authentication context
export function useAuth() {
  // Retrieve the context value
  const context = useContext(AuthContext)
  
  // Throw an error if the hook is used outside of the AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 