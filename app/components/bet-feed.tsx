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
  filter?: string
  bookmarksOnly?: boolean
}

interface BetResponse {
  bets: Bet[]
  nextPage: number | null
}

type BetQueryKey = ['bets', string, string | undefined, boolean]

export function BetFeed({ userId, filter = 'active', bookmarksOnly = false }: BetFeedProps) {
  const { ref, inView } = useInView()

  const fetchBets = async (context: QueryFunctionContext<BetQueryKey, number>) => {
    const { pageParam = 1 } = context
    
    const searchParams = new URLSearchParams({
      page: pageParam.toString(),
      filter,
      ...(userId && { userId }),
      ...(bookmarksOnly && { bookmarksOnly: 'true' })
    })
    
    const response = await fetch(`/api/bets?${searchParams}`)
    if (!response.ok) throw new Error('Network response was not ok')
    const data: BetResponse = await response.json()
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
    queryKey: ['bets', filter, userId, bookmarksOnly] as const,
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
    <div className="space-y-6">
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