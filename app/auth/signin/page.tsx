'use client'

import { LoginForm } from '../../components/login-form'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export default function LoginPage() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('light')
  }, [setTheme])

  return (
    <div className="container flex items-center justify-center min-h-screen py-12" suppressHydrationWarning>
      <LoginForm />
    </div>
  )
} 