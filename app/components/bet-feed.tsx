'use client'

// Import necessary dependencies and components
import { useState } from 'react'
import { BetCard } from './bet-card'
import { InfiniteScroll } from './infinite-scroll'
import { useBets } from '@/hooks/useBets'
import { Bet } from '@/types'

// Define props interface for BetFeed component
interface BetFeedProps {
  userId?: string
  filter?: 'active' | 'completed' | 'all'
  bookmarksOnly?: boolean
}

// BetFeed component that displays a scrollable list of bets
export function BetFeed({ userId, filter = 'all', bookmarksOnly = false }: BetFeedProps) {
  // State to track the current page for infinite scroll
  const [page, setPage] = useState(1)
  const { bets, isLoading, hasMore } = useBets({ page, userId, filter, bookmarksOnly })

  // Function to load more bets when scrolling
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  // Render a message if no bets are found and loading is complete
  if (bets.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bets found
      </div>
    )
  }

  // Render the feed with infinite scroll functionality
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