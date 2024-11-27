'use client'

import { BetFeed } from '@/app/components/bet-feed'

export default function HomePage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Latest Bets</h1>
      <BetFeed filter="active" />
    </div>
  )
}

