import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import type { Bet } from '@/types'

interface UseBetsParams {
  filter: string
  page: number
  userId?: string
  bookmarksOnly?: boolean
}

export const useBets = ({ filter, page, userId, bookmarksOnly = false }: UseBetsParams) => {
  const [bets, setBets] = useState<Bet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchBets = async () => {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(
          `/api/bets?filter=${filter}&userId=${userId}&page=${page}&bookmarksOnly=${bookmarksOnly}`
        )
        
        if (response.ok) {
          const data = await response.json()
          const pageSize = 10
          setHasMore(data.length === pageSize)
          
          if (page === 1) {
            setBets(data)
          } else {
            setBets(prev => [...prev, ...data])
          }
        }
      } catch (error) {
        console.error('Error fetching bets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBets()
  }, [filter, userId, page, bookmarksOnly])

  return { bets, isLoading, hasMore }
} 