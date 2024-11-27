'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

const CreateBetForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [opponent, setOpponent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!description.trim() || !deadline || !opponent.trim()) {
      toast.error('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          deadline: deadline.toISOString(),
          opponent: opponent.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create bet')
      }

      toast.success('Bet created successfully!')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error details:', {
        error,
        description,
        deadline,
        opponent
      })
      toast.error('Error creating bet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold tracking-tight">Create a New Bet</h2>
        <p className="text-sm text-muted-foreground">Enter the details of your bet below.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              placeholder="Describe your bet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              aria-label="Bet description"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="opponent">Opponent</label>
            <Input
              id="opponent"
              placeholder="Enter opponent's name"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              aria-label="Opponent name"
            />
          </div>

          <div className="space-y-2">
            <label>Deadline</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !deadline && 'text-muted-foreground'
                  )}
                  aria-label="Select deadline"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date: Date | undefined) => setDeadline(date)}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            aria-label="Create bet"
          >
            {isLoading ? 'Creating...' : 'Create Bet'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateBetForm 