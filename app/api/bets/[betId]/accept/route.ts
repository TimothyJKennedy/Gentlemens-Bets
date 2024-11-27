import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get betId from request body
    const { betId } = await request.json()

    if (!betId) {
      return NextResponse.json(
        { message: 'Bet ID is required' },
        { status: 400 }
      )
    }

    const bet = await prisma.bet.findUnique({
      where: { id: betId }
    })

    if (!bet) {
      return NextResponse.json(
        { message: 'Bet not found' },
        { status: 404 }
      )
    }

    if (bet.opponentId !== session.user.id) {
      return NextResponse.json(
        { message: 'You are not authorized to accept this bet' },
        { status: 403 }
      )
    }

    const updatedBet = await prisma.bet.update({
      where: { id: betId },
      data: { 
        status: 'ACTIVE',
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedBet)
  } catch (error) {
    console.error('Error accepting bet:', error)
    return NextResponse.json(
      { message: 'Error accepting bet' },
      { status: 500 }
    )
  }
} 