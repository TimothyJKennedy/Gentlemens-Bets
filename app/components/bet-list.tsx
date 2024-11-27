'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useInView } from 'react-intersection-observer'
import { useBets } from '@/hooks/useBets'
import type { Bet, BetFilter } from '@/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { FaHeart, FaComment, FaShare, FaBookmark } from 'react-icons/fa'

interface BetListProps {
  filter: BetFilter
}

export default function BetList({ filter }: BetListProps) {
  const { data: session } = useSession()
  const [page, setPage] = useState(1)
  const { bets, isLoading, hasMore } = useBets({
    filter,
    page,
    userId: session?.user?.id,
    bookmarksOnly: false
  })
  const [localBets, setLocalBets] = useState<Bet[]>([])
  const { ref, inView } = useInView()

  useEffect(() => {
    if (bets) {
      setLocalBets(bets)
    }
  }, [bets])

  useEffect(() => {
    if (inView && hasMore) {
      setPage(prev => prev + 1)
    }
  }, [inView, hasMore])

  const handleAcceptBet = async (bet: Bet) => {
    try {
      const response = await fetch('/api/bets', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          betId: bet.id,
          action: 'accept'
        })
      })

      const data = await response.json()

      if (response.ok || data.alreadyActive) {
        if (filter === 'pending') {
          // Update local state to remove the accepted bet
          setLocalBets(prevBets => prevBets.filter(b => b.id !== bet.id))
        }
        toast.success(data.alreadyActive ? 'Bet is already active' : 'Bet accepted successfully!')
      } else {
        toast.error(data.message || 'Failed to accept bet')
      }
    } catch (error) {
      console.error('Error accepting bet:', error)
      toast.error('An error occurred while accepting the bet')
    }
  }

  if (isLoading && !localBets?.length) {
    return <div>Loading bets...</div>
  }

  if (!localBets || localBets.length === 0) {
    return <div>No {filter.toLowerCase()} bets found.</div>
  }

  return (
    <div className="grid gap-4">
      {localBets.map((bet: Bet) => (
        <Card key={bet.id} className="p-4">
          <CardContent>
            <div className="flex justify-between items-center">
              {/* Left: Creator */}
              <div className="flex flex-col items-center">
                <Avatar className="mb-2">
                  <AvatarImage src={bet.creator.profileImage || ''} />
                  <AvatarFallback>{bet.creator.username[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{bet.creator.username}</span>
              </div>

              {/* Center: Bet Details */}
              <div className="flex-1 mx-8 text-center">
                <p className="text-lg mb-2">{bet.description}</p>
                <p className="text-sm text-gray-500">
                  Deadline: {new Date(bet.deadline).toLocaleDateString()}
                </p>
              </div>

              {/* Right: Opponent */}
              <div className="flex flex-col items-center">
                <Avatar className="mb-2">
                  <AvatarImage src={bet.opponent.profileImage || ''} />
                  <AvatarFallback>{bet.opponent.username[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{bet.opponent.username}</span>
                <span className="text-sm text-gray-500 mt-1">{bet.status}</span>
              </div>
            </div>

            {/* Bottom: Interaction Buttons */}
            <div className="flex justify-between mt-4 px-4">
              <button className="hover:text-gray-600 flex items-center gap-1">
                <FaHeart className="text-gray-500" /> {bet.likes || 0}
              </button>
              <button className="hover:text-gray-600 flex items-center gap-1">
                <FaComment className="text-gray-500" /> {bet.comments || 0}
              </button>
              <button className="hover:text-gray-600">
                <FaShare className="text-gray-500" />
              </button>
              <button className="hover:text-gray-600">
                <FaBookmark className="text-gray-500" />
              </button>
            </div>
          </CardContent>

          {filter === 'pending' && bet.opponentId === session?.user?.id && (
            <CardFooter>
              <Button onClick={() => handleAcceptBet(bet)}>
                Accept
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
      
      {hasMore && (
        <div ref={ref} className="h-10">
          {isLoading && <div>Loading more...</div>}
        </div>
      )}
    </div>
  )
} 