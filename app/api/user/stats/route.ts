import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [activeBetsCount, completedBetsCount] = await Promise.all([
    prisma.bet.count({
      where: {
        OR: [
          { opponentId: session.user.id, status: 'ACTIVE' }
        ]
      }
    }),
    prisma.bet.count({
      where: {
        OR: [
          { creatorId: session.user.id, status: 'COMPLETED' },
          { opponentId: session.user.id, status: 'COMPLETED' }
        ]
      }
    })
  ])

  return NextResponse.json({ activeBetsCount, completedBetsCount })
} 