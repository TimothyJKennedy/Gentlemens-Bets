import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test users
  const password = await hash('password123', 12)
  
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      username: 'alice',
      password,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      username: 'bob',
      password,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      email: 'charlie@example.com',
      username: 'charlie',
      password,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie'
    },
  })

  // Create test bets
  const betDescriptions = [
    "First one to run a marathon wins $100",
    "I bet I can eat more hot dogs in 10 minutes",
    "Whoever gets more steps this week wins",
    "I'll learn React before you learn Vue",
    "I bet the Lakers win the championship this year",
    "First to lose 10 pounds wins the bet",
    "I can do more pushups than you",
    "Bet I can finish this project before deadline",
    "I'll beat you in the next chess match",
    "Whoever gets promoted first owes the other dinner",
    "I bet I can go a month without social media",
    "First to learn a new language wins"
  ]

  const statuses = ['PENDING', 'ACTIVE', 'COMPLETED']

  for (const description of betDescriptions) {
    const creator = [user1, user2, user3][Math.floor(Math.random() * 3)]
    const possibleOpponents = [user1, user2, user3].filter(u => u.id !== creator.id)
    const opponent = Math.random() > 0.3 ? possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)] : null
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    await prisma.bet.create({
      data: {
        description,
        creatorId: creator.id,
        opponentId: opponent?.id,
        status,
        deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within next 30 days
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last 7 days
      },
    })
  }

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 