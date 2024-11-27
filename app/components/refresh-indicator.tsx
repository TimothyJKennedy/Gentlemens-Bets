import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface RefreshIndicatorProps {
  isPulling: boolean
  isRefreshing: boolean
  pullProgress: number
  error: string | null
}

export function RefreshIndicator({ 
  isPulling, 
  isRefreshing, 
  pullProgress, 
  error 
}: RefreshIndicatorProps) {
  return (
    <AnimatePresence>
      {(isPulling || isRefreshing || error) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-background/80 backdrop-blur-sm border-b"
        >
          <div className="py-3 flex items-center gap-2">
            {isRefreshing ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : isPulling ? (
              <motion.div
                style={{
                  rotate: `${Math.min(pullProgress * 2.7, 270)}deg`
                }}
                className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full"
              />
            ) : null}
            
            <span className="text-sm">
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : isRefreshing ? (
                'Refreshing...'
              ) : isPulling ? (
                pullProgress >= 100 ? 
                  'Release to refresh' : 
                  'Pull to refresh'
              ) : null}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 