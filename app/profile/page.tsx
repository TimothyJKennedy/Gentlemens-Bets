'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { BetFeed } from '@/app/components/bet-feed'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-8 mt-16">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.profileImage || ''} alt={user.name || 'User'} />
          <AvatarFallback className="text-lg">{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8" role="group" aria-label="Betting Statistics">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold" aria-label="Active Bets Count">
              {user.activeBetsCount ?? 0}
            </p>
            <p className="text-sm text-muted-foreground">Active Bets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold" aria-label="Completed Bets Count">
              {user.completedBetsCount ?? 0}
            </p>
            <p className="text-sm text-muted-foreground">Completed Bets</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="mt-8" role="tablist" aria-label="Betting History">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" role="tab" aria-label="View Active Bets">
            Active Bets
          </TabsTrigger>
          <TabsTrigger value="completed" role="tab" aria-label="View Completed Bets">
            Completed Bets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" role="tabpanel" aria-label="Active Bets Panel">
          <BetFeed 
            userId={user.id} 
            type="active"
            className="mt-6" 
          />
        </TabsContent>
        
        <TabsContent value="completed" role="tabpanel" aria-label="Completed Bets Panel">
          <BetFeed 
            userId={user.id} 
            type="completed"
            className="mt-6" 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

