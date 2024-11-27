'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BetList } from '@/app/components/bet-list'

export default function BetsPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Manage Your Bets</h1>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <BetList filter="PENDING" />
        </TabsContent>
        <TabsContent value="active">
          <BetList filter="ACTIVE" />
        </TabsContent>
        <TabsContent value="completed">
          <BetList filter="COMPLETED" />
        </TabsContent>
      </Tabs>
    </div>
  )
} 