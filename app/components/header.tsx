'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { NavMenu } from './nav-menu'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background z-40">
      <div className="container h-full flex items-center px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-accent/50 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold">Gentlemen&apos;s Bet</h1>
        </div>
        
        <div className="w-9" />
      </div>

      <NavMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  )
} 