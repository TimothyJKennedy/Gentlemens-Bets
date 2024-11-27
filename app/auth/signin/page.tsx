'use client'

// Import dynamic from Next.js to enable dynamic imports
import dynamic from 'next/dynamic'

// Dynamically import the LoginForm component without server-side rendering
const LoginForm = dynamic(
  () => import('../../components/login-form').then(mod => mod.LoginForm),
  { ssr: false } // Disable server-side rendering for this component
)

// Define the LoginPage component
export default function LoginPage() {
  return (
    // Center the LoginForm component within the page
    <div className="container flex items-center justify-center min-h-screen py-12">
      <LoginForm />
    </div>
  )
} 