import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: Request, { params }: { params: { betId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bet = await prisma.bet.findUnique({
      where: { id: params.betId }
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
      where: { id: params.betId },
      data: { status: 'ACTIVE' }
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