// Import NextAuth's useSession hook for session management
import { useSession } from 'next-auth/react'

// Define the User interface for type-safe user data handling
export interface User {
  id: string
  name: string | null
  email: string | null
  profileImage: string | null
}

// Custom hook to access and transform the auth session data
export function useAuth() {
  // Destructure session data and loading status from NextAuth
  const { data: session, status } = useSession()
  
  // Return transformed user data and loading state
  return {
    user: session?.user ? {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      profileImage: session.user.image ?? null,
    } : null,
    isLoading: status === 'loading'
  }
} 