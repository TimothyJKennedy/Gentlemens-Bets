import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Try to count users - simple query to test connection
    const count = await prisma.user.count()
    return NextResponse.json({ message: 'Database connected!', count })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { message: 'Failed to connect to database' },
      { status: 500 }
    )
  }
} 