'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { BetCard } from './bet-card'
import { Loader2 } from 'lucide-react'
import type { Bet } from '@/types'
import type { InfiniteData, QueryFunctionContext } from '@tanstack/react-query'

interface BetFeedProps {
  userId?: string
  type: 'active' | 'completed'
  className?: string
}

interface BetResponse {
  bets: Bet[]
  nextPage: number | null
}

type BetQueryKey = ['bets', string, string | undefined, 'active' | 'completed']

export function BetFeed({ userId, type, className = '' }: BetFeedProps) {
  const { ref, inView } = useInView()

  const fetchBets = async (context: QueryFunctionContext<BetQueryKey, number>) => {
    const { pageParam = 1 } = context
    
    const searchParams = new URLSearchParams({
      page: pageParam.toString(),
      type,
      ...(userId && { userId }),
    })
    
    const response = await fetch(`/api/bets?${searchParams}`)
    if (!response.ok) throw new Error('Network response was not ok')
    const data: BetResponse = await response.json()
    
    console.log('Fetched Bets:', data.bets)
    
    return data
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching
  } = useInfiniteQuery<BetResponse, Error, InfiniteData<BetResponse>, BetQueryKey, number>({
    queryKey: ['bets', type, userId, type] as const,
    queryFn: fetchBets,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Error: {error.message}</div>
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {data?.pages.map((page: BetResponse) => (
        <div key={page.bets[0]?.id ?? 'empty-page'} className="space-y-6">
          {page.bets.map((bet: Bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  )
} 