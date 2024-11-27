'use client'

import { useSession } from 'next-auth/react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Bet } from '@prisma/client'

interface BetListProps {
  filter: string
}

interface PageData {
  bets: CustomBet[];
  nextPage: number | null;
}

interface CustomBet {
  id: string;
  creatorId: string;
  opponentId: string;
  description: string;
  deadline: Date;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLATION_REQUESTED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
  cancellationRequesterId: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    username: string;
  };
  opponent?: {
    id: string;
    username: string;
  };
}

export default function BetList({ filter }: BetListProps) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const { ref, inView } = useInView()

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['bets', filter],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/bets?page=${pageParam}&filter=${filter}`
      )
      const data: PageData = await response.json()
      return data
    },
    getNextPageParam: (lastPage: PageData) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  })

  useEffect(() => {
    if (data) {
      console.log('Current data:', data)
    }
  }, [data])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleCancellationRequest = async (betId: string) => {
    try {
      const response = await fetch('/api/bets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId, action: 'request-cancellation' })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      
      toast.success('Cancellation requested')
      await queryClient.invalidateQueries({ queryKey: ['bets'] })
    } catch (error) {
      console.error('Error requesting cancellation:', error)
      toast.error('Failed to request cancellation')
    }
  }

  const handleCancellationResponse = async (betId: string, action: 'approve-cancellation' | 'reject-cancellation') => {
    try {
      const response = await fetch('/api/bets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId, action })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      
      toast.success(action === 'approve-cancellation' 
        ? 'Cancellation accepted' 
        : 'Cancellation rejected'
      )
      await queryClient.invalidateQueries({ queryKey: ['bets'] })
    } catch (error) {
      console.error('Error responding to cancellation:', error)
      toast.error(`Failed to ${action === 'approve-cancellation' ? 'accept' : 'reject'} cancellation`)
    }
  }

  const handleAcceptBet = async (betId: string) => {
    try {
      const response = await fetch('/api/bets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId, action: 'accept' })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      
      toast.success('Bet accepted')
      // Force a refresh of the query data
      await queryClient.invalidateQueries({ queryKey: ['bets'] })
    } catch (error) {
      toast.error('Failed to accept bet')
    }
  }

  const handleRejectBet = async (betId: string) => {
    try {
      const response = await fetch('/api/bets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId, action: 'reject' })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      
      toast.success('Bet rejected')
      // Invalidate queries for all bet categories
      await queryClient.invalidateQueries({ queryKey: ['bets'] })
    } catch (error) {
      console.error('Error rejecting bet:', error)
      toast.error('Failed to reject bet')
    }
  }

  const renderActionButtons = (bet: CustomBet) => {
    if (!session?.user?.id) return null;

    // For PENDING bets (initial bet acceptance)
    if (bet.status === 'PENDING') {
      if (session.user.id === bet.opponentId) {
        return (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => handleAcceptBet(bet.id)}
            >
              Accept Bet
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRejectBet(bet.id)}
            >
              Reject Bet
            </Button>
          </div>
        );
      }
      return <span className="text-muted-foreground">Awaiting Response</span>;
    }

    // For ACTIVE bets
    if (bet.status === 'ACTIVE') {
      return (
        <Button
          variant="outline"
          onClick={() => handleCancellationRequest(bet.id)}
        >
          Request Cancellation
        </Button>
      );
    }

    // For CANCELLATION_REQUESTED bets
    if (bet.status === 'CANCELLATION_REQUESTED') {
      // Debug log to verify the values we're working with
      console.log('Cancellation Request Debug:', {
        currentUserId: session.user.id,
        cancellationRequesterId: bet.cancellationRequesterId,
        isRequester: session.user.id === bet.cancellationRequesterId,
        betId: bet.id,
        betStatus: bet.status
      });

      // Strict equality check for the requester
      if (session.user.id === bet.cancellationRequesterId) {
        return <span className="text-muted-foreground">Awaiting Response</span>;
      }

      // For the non-requesting user
      return (
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => handleCancellationResponse(bet.id, 'approve-cancellation')}
          >
            Accept Cancellation
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleCancellationResponse(bet.id, 'reject-cancellation')}
          >
            Reject Cancellation
          </Button>
        </div>
      );
    }

    return null;
  }

  if (status === 'pending') return <div>Loading...</div>
  if (status === 'error') return <div>Error: {(error as Error).message}</div>

  return (
    <div className="space-y-4">
      {data?.pages.map((page: PageData) => (
        <div key={page.nextPage}>
          {page.bets.map((bet: CustomBet) => (
            <Card key={bet.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{bet.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Deadline: {new Date(bet.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {renderActionButtons(bet)}
              </CardFooter>
            </Card>
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <div ref={ref}>
          {isFetchingNextPage ? 'Loading more...' : ''}
        </div>
      )}
    </div>
  )
} 