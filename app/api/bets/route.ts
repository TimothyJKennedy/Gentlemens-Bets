import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { BetStatus } from '@/types'

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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const filter = searchParams.get('filter') || 'all'
    const pageSize = 10

    // Build the where clause based on the filter
    let whereClause: any = {
      OR: [
        { creatorId: session.user.id },
        { opponentId: session.user.id }
      ]
    }

    // Update filter logic to include CANCELLATION_REQUESTED in pending
    switch (filter) {
      case 'pending':
        whereClause.status = {
          in: ['PENDING', 'CANCELLATION_REQUESTED']
        }
        break
      case 'active':
        whereClause.status = 'ACTIVE'
        break
      case 'completed':
        whereClause.status = {
          in: ['COMPLETED', 'CANCELLED']
        }
        break
    }

    const totalBets = await prisma.bet.count({
      where: whereClause
    })

    const bets = await prisma.bet.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { id: true, username: true }
        },
        opponent: {
          select: { id: true, username: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return NextResponse.json({
      bets,
      nextPage: totalBets > page * pageSize ? page + 1 : null,
      totalBets
    })
  } catch (error) {
    console.error('Error in GET /api/bets:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Current session:', {
      session: session ? {
        user: session.user,
        // log other non-sensitive session data
      } : null
    })

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Debug: Check all users in database
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true
      }
    })
    console.log('All users in database:', allUsers)
    
    const body = await request.json()
    console.log('Creating bet with data:', body)

    // Validate required fields
    if (!body.description || !body.deadline || !body.opponent) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find opponent by username
    console.log('Looking for opponent with username:', body.opponent)
    const opponent = await prisma.user.findUnique({
      where: { 
        username: body.opponent.trim() // Add trim() to remove any whitespace
      }
    })

    console.log('Found opponent:', opponent) // Log the found opponent

    if (!opponent) {
      return NextResponse.json(
        { message: `Opponent with username "${body.opponent}" not found` },
        { status: 404 }
      )
    }

    // Create the bet
    const bet = await prisma.bet.create({
      data: {
        description: body.description,
        deadline: new Date(body.deadline),
        creatorId: session.user.id,
        opponentId: opponent.id,
        status: 'PENDING'
      },
      include: {
        creator: {
          select: { id: true, username: true }
        },
        opponent: {
          select: { id: true, username: true }
        }
      }
    })

    console.log('Created bet:', bet)
    return NextResponse.json(bet)
  } catch (error) {
    console.error('Error in POST /api/bets:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
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

    const { betId, action } = await request.json()
    
    console.log('Processing bet action:', { betId, action, userId: session.user.id })

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

    let result;

    switch (action) {
      case 'request-cancellation':
        if (bet.status !== 'ACTIVE') {
          return NextResponse.json(
            { message: 'Only active bets can be cancelled' },
            { status: 400 }
          )
        }

        result = await prisma.bet.update({
          where: { id: betId },
          data: {
            status: 'CANCELLATION_REQUESTED',
            cancellationRequesterId: session.user.id
          } as any,
          include: {
            creator: {
              select: { id: true, username: true }
            },
            opponent: {
              select: { id: true, username: true }
            }
          }
        })
        
        console.log('Updated bet with cancellation request:', result)
        return NextResponse.json(result)

      case 'accept':
        console.log('Attempting to accept bet:', {
          currentStatus: bet.status,
          userId: session.user.id,
          opponentId: bet.opponentId
        })
        
        if (bet.status !== 'PENDING') {
          console.log('Invalid status for accept:', bet.status)
          return NextResponse.json(
            { message: `Bet cannot be accepted. Current status: ${bet.status}` },
            { status: 400 }
          )
        }

        if (session.user.id !== bet.opponentId) {
          return NextResponse.json(
            { message: 'Only the opponent can accept the bet' },
            { status: 403 }
          )
        }

        const updatedBet = await prisma.bet.update({
          where: { id: betId },
          data: { status: 'ACTIVE' }
        })
        console.log('Bet updated to active:', updatedBet)
        return NextResponse.json({ message: 'Bet accepted successfully' })

      case 'reject':
        console.log('Attempting to reject bet:', {
          currentStatus: bet.status,
          userId: session.user.id,
          opponentId: bet.opponentId
        })

        if (bet.status !== 'PENDING') {
          return NextResponse.json(
            { message: 'Bet is not in pending status' },
            { status: 400 }
          )
        }

        if (session.user.id !== bet.opponentId) {
          return NextResponse.json(
            { message: 'Only the opponent can reject the bet' },
            { status: 403 }
          )
        }

        // Delete the bet instead of updating status
        await prisma.bet.delete({
          where: { id: betId }
        })
        
        console.log('Bet deleted:', betId)
        return NextResponse.json({ message: 'Bet rejected and deleted' })

      case 'approve-cancellation':
      case 'reject-cancellation':
        if (bet.status !== 'CANCELLATION_REQUESTED') {
          return NextResponse.json(
            { message: 'Bet is not pending cancellation' },
            { status: 400 }
          )
        }
        await prisma.bet.update({
          where: { id: betId },
          data: { 
            status: action === 'approve-cancellation' ? 'CANCELLED' : 'ACTIVE' 
          }
        })
        break

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ message: 'Success' })
  } catch (error) {
    console.error('Error in PATCH /api/bets:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 