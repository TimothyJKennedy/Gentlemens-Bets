'use client'

// Import necessary hooks and components
import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

// Define props interface for InfiniteScroll component
interface InfiniteScrollProps {
  loadMore: () => void
  hasMore: boolean
  isLoading: boolean
  children: React.ReactNode
}

// InfiniteScroll component that handles infinite loading
export function InfiniteScroll({ loadMore, hasMore, isLoading, children }: InfiniteScrollProps) {
  // Create a ref to the observer target element
  const observerTarget = useRef(null)

  // Set up an effect to observe the observer target
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If target is visible and there are more items to load and not loading, load more
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )

    // Observe the target element if it exists
    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    // Clean up the observer when the component unmounts
    return () => observer.disconnect()
  }, [loadMore, hasMore, isLoading])

  // Render the component with the children and the observer target
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