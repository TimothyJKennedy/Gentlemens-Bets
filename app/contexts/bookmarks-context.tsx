'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export interface BookmarkData {
  id: string
  creator: {
    id: string
    name: string
    profileImage?: string
  }
  opponent: {
    id: string
    name: string
    profileImage?: string
  }
  description: string
  deadline: Date
  createdAt: Date
}

interface BookmarksContextType {
  bookmarks: BookmarkData[]
  isBookmarked: (betId: string) => boolean
  addBookmark: (bookmark: BookmarkData) => void
  removeBookmark: (betId: string) => void
  isLoading: boolean
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('bookmarks')
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
    setIsLoading(false)
  }, [])

  const isBookmarked = (betId: string) => {
    return bookmarks.some(bookmark => bookmark.id === betId)
  }

  const addBookmark = (bookmark: BookmarkData) => {
    const newBookmarks = [...bookmarks, bookmark]
    setBookmarks(newBookmarks)
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
  }

  const removeBookmark = (betId: string) => {
    const newBookmarks = bookmarks.filter(bookmark => bookmark.id !== betId)
    setBookmarks(newBookmarks)
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
  }

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, addBookmark, removeBookmark, isLoading }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarksContext)
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider')
  }
  return context
} 