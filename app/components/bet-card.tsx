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

export function BetCard({ bet }: BetCardProps) {
  return (
    <Card className="p-4">
      {/* Main bet content with simplified layout */}
      <div className="flex items-center justify-between">
        {/* Left side - Creator */}
        <div className="flex flex-col items-center">
          <Link href={`/profile/${bet.creator.id}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={bet.creator.profileImage} />
              <AvatarFallback>{bet.creator.username[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/profile/${bet.creator.id}`} className="text-sm mt-1">
            {bet.creator.username}
          </Link>
        </div>

        {/* Right side - Opponent */}
        <div className="flex flex-col items-center">
          {bet.opponent ? (
            <>
              <Link href={`/profile/${bet.opponent.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={bet.opponent.profileImage} />
                  <AvatarFallback>{bet.opponent.username[0]}</AvatarFallback>
                </Avatar>
              </Link>
              <Link href={`/profile/${bet.opponent.id}`} className="text-sm mt-1">
                {bet.opponent.username}
              </Link>
            </>
          ) : (
            <>
              <Avatar className="h-8 w-8">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <span className="text-sm mt-1">bob</span>
            </>
          )}
        </div>
      </div>

      {/* Centered bet description and deadline */}
      <div className="mt-4 mb-2 text-center">
        <p className="text-sm font-medium">{bet.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            Deadline: {format(new Date(bet.deadline), 'MMM d, yyyy')}
          </span>
          <span className="text-xs text-muted-foreground">ACTIVE</span>
        </div>
      </div>

      {/* Simplified action buttons */}
      <CardFooter className="flex justify-start gap-4 pt-2 px-0 pb-0">
        <Button variant="ghost" size="sm" className="text-muted-foreground p-0 h-auto">
          <Heart className="h-4 w-4" />
          <span className="text-xs ml-1">0</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground p-0 h-auto">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs ml-1">0</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground p-0 h-auto">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground p-0 h-auto ml-auto">
          <Bookmark className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

