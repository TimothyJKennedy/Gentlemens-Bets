'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

interface Bet {
  id: string
  description: string
  status: string
  deadline: Date
  createdAt: Date
  creator: {
    id: string
    username: string
  }
  opponent: {
    id: string
    username: string
  }
}

interface BetListProps {
  filter: 'PENDING' | 'ACTIVE' | 'COMPLETED'
}

export function BetList({ filter }: BetListProps) {
  const { data: session } = useSession()
  const [bets, setBets] = useState<Bet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBets() {
      try {
        const response = await fetch(`/api/bets?filter=${filter.toLowerCase()}&userId=${session?.user?.id}`)
        const data = await response.json()
        setBets(data.bets)
      } catch (error) {
        console.error('Error fetching bets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchBets()
    }
  }, [filter, session?.user?.id])

  const handleAcceptBet = async (betId: string) => {
    try {
      const response = await fetch(`/api/bets/${betId}/accept`, {
        method: 'POST',
      })
      if (response.ok) {
        // Refresh the bets list
        const updatedBets = bets.map(bet => 
          bet.id === betId ? { ...bet, status: 'ACTIVE' } : bet
        )
        setBets(updatedBets)
      }
    } catch (error) {
      console.error('Error accepting bet:', error)
    }
  }

  const handleCancelBet = async (betId: string) => {
    try {
      const response = await fetch(`/api/bets/${betId}/cancel`, {
        method: 'POST',
      })
      if (response.ok) {
        // Remove the bet from the list
        setBets(bets.filter(bet => bet.id !== betId))
      }
    } catch (error) {
      console.error('Error canceling bet:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (bets.length === 0) {
    return <div>No {filter.toLowerCase()} bets found.</div>
  }

  return (
    <div className="space-y-4">
      {bets.map((bet) => (
        <Card key={bet.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{bet.description}</h3>
                <p className="text-sm text-muted-foreground">
                  Between {bet.creator.username} and {bet.opponent.username}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(bet.deadline), { addSuffix: true })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {filter === 'PENDING' && bet.opponent.id === session?.user?.id && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleCancelBet(bet.id)}
                >
                  Decline
                </Button>
                <Button 
                  onClick={() => handleAcceptBet(bet.id)}
                >
                  Accept
                </Button>
              </>
            )}
            {filter === 'PENDING' && bet.creator.id === session?.user?.id && (
              <Button 
                variant="outline" 
                onClick={() => handleCancelBet(bet.id)}
              >
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 