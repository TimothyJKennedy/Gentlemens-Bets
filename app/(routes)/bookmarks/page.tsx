'use client'

import { BetFeed } from '@/app/components/bet-feed'

export default function BookmarksPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Your Bookmarks</h1>
      <BetFeed bookmarksOnly={true} />
    </div>
  )
}