import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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
    const page = parseInt(searchParams.get('page') || '1')
    const userId = searchParams.get('userId')
    const filter = searchParams.get('filter')
    const bookmarksOnly = searchParams.get('bookmarksOnly') === 'true'

    const skip = (page - 1) * ITEMS_PER_PAGE

    const whereConditions: WhereClause = {
      AND: [
        { opponentId: { not: null } },
        ...(filter === 'active' ? [{ status: 'ACTIVE' }] :
          filter === 'completed' ? [{ status: 'COMPLETED' }] : 
          []),
        ...(userId ? [{
          OR: [
            { creatorId: userId },
            { opponentId: userId }
          ]
        }] : []),
        ...(bookmarksOnly && userId ? [{
          bookmarks: {
            some: { userId }
          }
        }] : [])
      ].filter(Boolean) as WhereClause['AND']
    }

    const bets = await prisma.bet.findMany({
      where: whereConditions,
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
      take: ITEMS_PER_PAGE,
      skip
    })

    return NextResponse.json({ bets })
  } catch (error) {
    console.error('Error fetching bets:', error)
    return NextResponse.json(
      { message: 'Error fetching bets' },
      { status: 500 }
    )
  }
} 