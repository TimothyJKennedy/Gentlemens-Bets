import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const ITEMS_PER_PAGE = 10

type WhereClause = {
  AND: (
    | { opponentId: { not: null } }
    | { status: string }
    | { OR: { creatorId: string; opponentId: string }[] }
    | { bookmarks: { some: { userId: string } } }
  )[]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 10

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const bets = await prisma.bet.findMany({
      where: {
        AND: [
          {
            OR: [
              { creatorId: userId },
              { opponentId: userId }
            ]
          },
          filter === 'pending' 
            ? { status: 'PENDING' }
            : filter === 'active'
            ? { status: 'ACTIVE' }
            : filter === 'completed'
            ? { status: 'COMPLETED' }
            : {}
        ],
        opponentId: {
          not: null
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        },
        opponent: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: pageSize,
      skip: (page - 1) * pageSize
    })

    return NextResponse.json(bets)
  } catch (error) {
    console.error('Error fetching bets:', error)
    return NextResponse.json(
      { message: 'Error fetching bets' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { description, deadline, opponent } = await request.json()

    // First find the opponent user by username
    const opponentUser = await prisma.user.findUnique({
      where: { username: opponent.trim() }
    })

    if (!opponentUser) {
      return NextResponse.json(
        { message: 'Opponent not found' },
        { status: 400 }
      )
    }

    const newBet = await prisma.bet.create({
      data: {
        description: description.trim(),
        deadline: new Date(deadline),
        opponentId: opponentUser.id,  // Use the actual user ID
        creatorId: session.user.id,   // Use creatorId directly
        status: 'PENDING',
      },
    })

    return NextResponse.json(newBet, { status: 201 })
  } catch (error) {
    console.error('Error creating bet:', error)
    return NextResponse.json(
      { message: 'Error creating bet' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { betId, action } = data

    const bet = await prisma.bet.findUnique({
      where: { id: betId },
      include: {
        creator: { select: { id: true, username: true } },
        opponent: { select: { id: true, username: true } }
      }
    })

    if (!bet) {
      return NextResponse.json({ message: 'Bet not found' }, { status: 404 })
    }

    switch (action) {
      case 'request-cancellation': {
        if (bet.status !== 'ACTIVE') {
          return NextResponse.json(
            { message: 'Can only request cancellation for active bets' },
            { status: 400 }
          )
        }

        if (![bet.creatorId, bet.opponentId].includes(session.user.id)) {
          return NextResponse.json(
            { message: 'Not authorized to request cancellation' },
            { status: 403 }
          )
        }

        // Store who requested cancellation in the status
        const updatedBet = await prisma.bet.update({
          where: { id: betId },
          data: {
            status: `CANCELLATION_REQUESTED_BY_${session.user.id}`
          }
        })

        return NextResponse.json({
          message: 'Cancellation requested successfully',
          bet: updatedBet
        })
      }

      case 'approve-cancellation': {
        if (!bet.status.startsWith('CANCELLATION_REQUESTED_BY_')) {
          return NextResponse.json(
            { message: 'No cancellation request pending' },
            { status: 400 }
          )
        }

        const requesterId = bet.status.replace('CANCELLATION_REQUESTED_BY_', '')
        if (requesterId === session.user.id) {
          return NextResponse.json(
            { message: 'Cannot approve your own cancellation request' },
            { status: 403 }
          )
        }

        const updatedBet = await prisma.bet.update({
          where: { id: betId },
          data: {
            status: 'CANCELLED'
          }
        })

        return NextResponse.json({
          message: 'Cancellation approved',
          bet: updatedBet
        })
      }

      case 'reject-cancellation': {
        if (!bet.status.startsWith('CANCELLATION_REQUESTED_BY_')) {
          return NextResponse.json(
            { message: 'No cancellation request pending' },
            { status: 400 }
          )
        }

        const requesterId = bet.status.replace('CANCELLATION_REQUESTED_BY_', '')
        if (requesterId === session.user.id) {
          return NextResponse.json(
            { message: 'Cannot reject your own cancellation request' },
            { status: 403 }
          )
        }

        const updatedBet = await prisma.bet.update({
          where: { id: betId },
          data: {
            status: 'ACTIVE'
          }
        })

        return NextResponse.json({
          message: 'Cancellation rejected',
          bet: updatedBet
        })
      }

      case 'accept':
        if (bet.status === 'ACTIVE') {
          return NextResponse.json({
            message: 'Bet is already active',
            bet: bet,
            alreadyActive: true
          })
        }

        if (bet.opponentId !== session.user.id) {
          return NextResponse.json(
            { message: 'Unauthorized to accept this bet' },
            { status: 403 }
          )
        }

        const updatedBet = await prisma.bet.update({
          where: { id: betId },
          data: { 
            status: 'ACTIVE',
            updatedAt: new Date()
          },
          include: {
            creator: {
              select: {
                id: true,
                username: true,
              },
            },
            opponent: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        })

        return NextResponse.json({
          message: 'Bet accepted successfully',
          bet: updatedBet,
          alreadyActive: false
        })

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 