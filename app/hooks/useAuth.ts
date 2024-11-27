import { useSession } from 'next-auth/react'

export interface User {
  id: string
  name: string | null
  email: string | null
  profileImage: string | null
}

export function useAuth() {
  const { data: session, status } = useSession()
  
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