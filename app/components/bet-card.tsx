'use client'

import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { Bet } from '@/types'

interface BetCardProps {
  bet: Bet
}

// BetCard component to display individual bet details
export function BetCard({ bet }: BetCardProps) {
  return (
    <Card className="p-4">
      {/* Main bet content with avatars */}
      <div className="flex items-center justify-between min-h-[100px]">
        {/* Creator side */}
        <div className="flex flex-col items-center">
          <Link href={`/profile/${bet.creator.id}`}>
            <Avatar className="h-12 w-12 mb-1">
              <AvatarImage src={bet.creator.profileImage} />
              <AvatarFallback>{bet.creator.username[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/profile/${bet.creator.id}`} className="text-sm font-medium hover:underline">
            {bet.creator.username}
          </Link>
        </div>

        {/* Bet description and deadline - adjusted margin and padding */}
        <div className="flex-1 mx-8 flex flex-col items-center justify-center py-4">
          <p className="text-sm font-medium mb-1 text-center">{bet.description}</p>
          <span className="text-xs text-muted-foreground">
            Deadline: {format(new Date(bet.deadline), 'MMM d, yyyy')}
          </span>
        </div>

        {/* Opponent side */}
        <div className="flex flex-col items-center">
          {bet.opponent ? (
            <>
              <Link href={`/profile/${bet.opponent.id}`}>
                <Avatar className="h-12 w-12 mb-1">
                  <AvatarImage src={bet.opponent.profileImage} />
                  <AvatarFallback>{bet.opponent.username[0]}</AvatarFallback>
                </Avatar>
              </Link>
              <Link href={`/profile/${bet.opponent.id}`} className="text-sm font-medium hover:underline">
                {bet.opponent.username}
              </Link>
            </>
          ) : (
            <div className="text-center">
              <Avatar className="h-12 w-12 mb-1">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Waiting</span>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">{bet.status}</span>
      </div>

      {/* Action buttons */}
      <CardFooter className="flex justify-between pt-4 px-0 pb-0">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Heart className="h-4 w-4 mr-2" />
          <span className="text-xs">0</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircle className="h-4 w-4 mr-2" />
          <span className="text-xs">0</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share2 className="h-4 w-4 mr-2" />
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Bookmark className="h-4 w-4 mr-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

