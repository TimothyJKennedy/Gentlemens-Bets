import { useState, useEffect } from 'react'

export interface User {
  id: string
  name: string | null
  email: string | null
  profileImage: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual auth check
    const mockUser: User = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      profileImage: null
    }
    setUser(mockUser)
    setIsLoading(false)
  }, [])

  return { user, isLoading }
} 