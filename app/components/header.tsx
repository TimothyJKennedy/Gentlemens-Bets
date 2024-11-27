'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { NavMenu } from './nav-menu'

// Header component that includes a navigation menu
export function Header() {
  // State to track if the navigation menu is open
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background z-40">
      {/* Header container */}
      <div className="container h-full flex items-center px-4">
        {/* Menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-accent/50 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Brand name */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold">Gentlemen&apos;s Bet</h1>
        </div>
        
        {/* Spacer */}
        <div className="w-9" />
      </div>

      {/* Navigation menu */}
      <NavMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {/* Overlay to close the menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  )
} 