import { useEffect, useState } from 'react'

interface PullToRefreshState {
  isPulling: boolean
  isRefreshing: boolean
  pullProgress: number
  error: string | null
}

export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullProgress: 0,
    error: null
  })
  
  useEffect(() => {
    let startY = 0
    const threshold = 150 // pixels to pull down before refresh triggers
    
    const handleTouchStart = (e: TouchEvent) => {
      setState(prev => ({ ...prev, error: null }))
      const scrollTop = document.documentElement.scrollTop
      if (scrollTop <= 0) {
        startY = e.touches[0].clientY
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (startY === 0 || state.isRefreshing) return
      
      const y = e.touches[0].clientY
      const pull = y - startY
      
      if (pull > 0) {
        e.preventDefault()
        const progress = Math.min((pull / threshold) * 100, 100)
        setState(prev => ({
          ...prev,
          isPulling: true,
          pullProgress: progress
        }))
      }
    }
    
    const handleTouchEnd = async () => {
      if (!state.isPulling || state.isRefreshing) return
      
      if (state.pullProgress >= 100) {
        setState(prev => ({ ...prev, isRefreshing: true }))
        try {
          await onRefresh()
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : 'Failed to refresh'
          }))
        } finally {
          setState(prev => ({ ...prev, isRefreshing: false }))
        }
      }
      
      startY = 0
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullProgress: 0
      }))
    }
    
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [state.isPulling, state.isRefreshing, state.pullProgress, onRefresh])
  
  return state
} 