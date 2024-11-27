import { useState, useEffect } from 'react'
import { Bet } from '@/types'

interface UseBetsProps {
  page: number
  userId?: string
  filter?: 'active' | 'completed' | 'all'
  bookmarksOnly?: boolean
}

interface UseBetsReturn {
  bets: Bet[]
  isLoading: boolean
  hasMore: boolean
}

interface APIBet {
  id: string
  description: string
  deadline: string
  status: string
  createdAt: string
  creator: {
    id: string
    username: string
    profileImage?: string
  }
  opponent?: {
    id: string
    username: string
    profileImage?: string
  }
}

interface APIResponse {
  bets: APIBet[]
}

export function useBets({ page, userId, filter, bookmarksOnly }: UseBetsProps): UseBetsReturn {
  const [bets, setBets] = useState<Bet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchBets = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          ...(userId && { userId }),
          ...(filter && { filter }),
          ...(bookmarksOnly && { bookmarksOnly: 'true' })
        })

        const response = await fetch(`/api/bets?${params}`)
        const data: APIResponse = await response.json()
        
        // Transform the data to match our types
        const transformedBets = data.bets.map((bet: APIBet) => ({
          ...bet,
          deadline: new Date(bet.deadline),
          createdAt: new Date(bet.createdAt),
          creator: {
            id: bet.creator.id,
            username: bet.creator.username,
            profileImage: bet.creator.profileImage
          },
          opponent: bet.opponent ? {
            id: bet.opponent.id,
            username: bet.opponent.username,
            profileImage: bet.opponent.profileImage
          } : undefined
        }))

        setBets(prev => page === 1 ? transformedBets : [...prev, ...transformedBets])
        setHasMore(transformedBets.length > 0)
      } catch (error) {
        console.error('Error fetching bets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBets()
  }, [page, userId, filter, bookmarksOnly])

  return { bets, isLoading, hasMore }
} 