'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'

export interface AuthUser {
  id: string
  name: string | null
  email: string | null
  profileImage: string | null
  activeBetsCount?: number
  completedBetsCount?: number
}

interface UserStats {
  activeBetsCount: number
  completedBetsCount: number
}

export function useAuth() {
  const { data: session } = useSession()
  const user = session?.user as AuthUser | null

  const { data: stats } = useQuery<UserStats>({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { activeBetsCount: 0, completedBetsCount: 0 }
      const response = await fetch('/api/user/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch user stats')
      }
      return response.json()
    },
    enabled: !!user?.id,
  })

  return {
    user: user ? {
      ...user,
      activeBetsCount: stats?.activeBetsCount ?? 0,
      completedBetsCount: stats?.completedBetsCount ?? 0,
    } : null,
  }
} 