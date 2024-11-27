'use client'

import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface InfiniteScrollProps {
  loadMore: () => void
  hasMore: boolean
  isLoading: boolean
  children: React.ReactNode
}

export function InfiniteScroll({ loadMore, hasMore, isLoading, children }: InfiniteScrollProps) {
  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMore, hasMore, isLoading])

  return (
    <div>
      {children}
      <div ref={observerTarget} className="h-4" />
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  )
} 