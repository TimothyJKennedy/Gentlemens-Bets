'use client'

import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Clock, Bookmark } from 'lucide-react'
import { Bet } from '@/types'
import { cn } from '@/lib/utils'

interface BetCardProps {
  bet: Bet
}

export function BetCard({ bet }: BetCardProps) {
  const getInitials = (username: string) => username[0].toUpperCase()
  const formattedDeadline = format(new Date(bet.deadline), 'MMM d, yyyy')

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Users and Status Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Creator */}
          <Link href={`/profile/${bet.creator.id}`} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={bet.creator.profileImage} alt={bet.creator.username} />
              <AvatarFallback>{getInitials(bet.creator.username)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{bet.creator.username}</span>
          </Link>

          {/* VS Indicator */}
          <span className="text-sm font-semibold text-muted-foreground">VS</span>

          {/* Opponent */}
          <Link href={`/profile/${bet.opponent.id}`} className="flex items-center gap-2">
            <span className="text-sm font-medium">{bet.opponent.username}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={bet.opponent.profileImage} alt={bet.opponent.username} />
              <AvatarFallback>{getInitials(bet.opponent.username)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* Bet Description */}
        <div className="space-y-4">
          <p className="text-sm">{bet.description}</p>
          
          {/* Deadline and Status */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Ends {formattedDeadline}</span>
            </div>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              bet.status === 'ACTIVE' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
              bet.status === 'PENDING' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
              bet.status === 'COMPLETED' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            )}>
              {bet.status}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Interaction Buttons */}
      <CardFooter className="px-6 py-4 border-t flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          aria-label="Like bet"
        >
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

