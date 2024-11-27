'use client'

import { useState } from 'react'
import { Calendar } from '../../components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export function CreateBetForm() {
  const [date, setDate] = useState<Date>()

  return (
    <Card className="max-w-2xl mx-auto border bg-card">
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Create a New Bet</h2>
        <p className="text-sm text-muted-foreground">
          Enter the details of your bet below.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="opponent" className="text-sm font-medium">
            Opponent
          </Label>
          <Input
            id="opponent"
            placeholder="Who are you betting against?"
            className="bg-background/50 border-border/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="What's the bet about?"
            className="min-h-[100px] bg-background/50 border-border/50 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-background/50 border-border/50',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          Create Bet
        </Button>
      </CardFooter>
    </Card>
  )
} 