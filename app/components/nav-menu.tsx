'use client'

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Home, User, Bell, Plus, Settings, LogOut, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { useAuth } from '@/app/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Interface for NavMenu props
interface NavMenuProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

// Navigation menu component that slides in from the left
export function NavMenu({ isOpen, setIsOpen }: NavMenuProps) {
  // Access theme context for dark/light mode switching
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full p-4">
          <div className="flex-1">
            <nav className="flex flex-col gap-1">
              {/* Profile section at the top */}
              <Link 
                href="/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage || ''} />
                  <AvatarFallback>{user?.name?.[0] || user?.email?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name || 'Profile'}</span>
                  <span className="text-xs text-muted-foreground">View profile</span>
                </div>
              </Link>

              {/* Home link moved below profile */}
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg"
              >
                <Home className="h-6 w-6" />
                <span className="text-lg">Home</span>
              </Link>

              {/* Rest of your navigation links */}
              <Link 
                href="/create" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg"
              >
                <Plus className="h-6 w-6" />
                <span className="text-lg">Create Bet</span>
              </Link>

              <Link 
                href="/notifications" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg"
              >
                <Bell className="h-6 w-6" />
                <span className="text-lg">Notifications</span>
              </Link>

              <Link 
                href="/settings" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg"
              >
                <Settings className="h-6 w-6" />
                <span className="text-lg">Settings</span>
              </Link>
            </nav>
          </div>
          
          <div className="border-t pt-4 space-y-4">
            <button
              className="flex items-center gap-4 p-3 w-full text-red-500 dark:text-red-400 hover:bg-accent rounded-lg"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            >
              <LogOut className="h-6 w-6" />
              <span className="text-lg">Log out</span>
            </button>

            <button 
              className="flex items-center gap-4 p-3 w-full hover:bg-accent rounded-lg"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-6 w-6" />
                  <span className="text-lg">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-6 w-6" />
                  <span className="text-lg">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 