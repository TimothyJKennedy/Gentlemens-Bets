'use client'

import { useState } from 'react'
import { BetCard } from './bet-card'
import { InfiniteScroll } from './infinite-scroll'
import { useBets } from '@/hooks/useBets'
import { Bet } from '@/types'

interface BetFeedProps {
  userId?: string
  filter?: 'active' | 'completed' | 'all'
  bookmarksOnly?: boolean
}

export function BetFeed({ userId, filter = 'all', bookmarksOnly = false }: BetFeedProps) {
  const [page, setPage] = useState(1)
  const { bets, isLoading, hasMore } = useBets({ page, userId, filter, bookmarksOnly })

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  if (bets.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bets found
      </div>
    )
  }

  return (
    <InfiniteScroll
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {bets.map((bet: Bet) => (
          <BetCard key={bet.id} bet={bet} />
        ))}
      </div>
    </InfiniteScroll>
  )
} 