'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { BetFeed } from '@/app/components/bet-feed'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header/Banner Area */}
      <div className="h-32 bg-muted"></div>
      
      {/* Profile Info Section */}
      <div className="relative px-4">
        <Avatar className="absolute -top-16 h-32 w-32 border-4 border-background">
          <AvatarImage src={user.profileImage || ''} />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        
        <div className="pt-20">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="mt-2">Bio goes here - We can add this to the user profile later</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 my-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Active Bets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">48</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">36</p>
              <p className="text-sm text-muted-foreground">Wins</p>
            </CardContent>
          </Card>
        </div>

        {/* Bets Tabs */}
        <Tabs defaultValue="active" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Bets</TabsTrigger>
            <TabsTrigger value="all">All Bets</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <BetFeed userId={params.id} filter="active" />
          </TabsContent>
          
          <TabsContent value="all">
            <BetFeed userId={params.id} />
          </TabsContent>
          
          <TabsContent value="completed">
            <BetFeed userId={params.id} filter="completed" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

