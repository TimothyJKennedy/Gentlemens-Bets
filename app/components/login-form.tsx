'use client'

// Import necessary modules and components
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define the LoginForm component
// Import necessary hooks and components
export function LoginForm() {
  const router = useRouter()
  // State variables for email and password inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission
    // Call signIn function from next-auth with credentials
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/' // Redirect to home page on successful sign-in
    })
  }

  return (
    // Suppress hydration warnings
    <div suppressHydrationWarning>
      <Card className="w-full max-w-md" suppressHydrationWarning>
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4" suppressHydrationWarning>
          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign in with Email
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground">
            Sign in to start betting with your friends
          </p>
          <div className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/auth/register')}
              className="text-primary hover:underline"
            >
              Register
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 