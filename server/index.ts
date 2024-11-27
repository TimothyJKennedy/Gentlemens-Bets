import { Server } from 'socket.io'
import { createServer } from 'http'
import { v4 as uuidv4 } from 'uuid'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const notifications = [
  {
    type: 'bet-request',
    title: 'New Bet Challenge',
    message: 'John Doe challenged you to a $50 bet on "Warriors vs Lakers"',
    data: { betId: '123', userId: 'john-doe' }
  },
  {
    type: 'bet-accepted',
    title: 'Bet Accepted',
    message: 'Jane Smith accepted your bet on "Next Snowfall Date"',
    data: { betId: '124', userId: 'jane-smith' }
  },
  {
    type: 'bet-rejected',
    title: 'Bet Rejected',
    message: 'Mike declined your bet on "Super Bowl Winner"',
    data: { betId: '125', userId: 'mike' }
  },
  {
    type: 'bet-deadline',
    title: '⚠️ Deadline Approaching',
    message: 'Your bet "First to Mars" ends in 24 hours',
    data: { betId: '126' }
  },
  {
    type: 'bet-dispute',
    title: '⚠️ Bet Disputed',
    message: 'Alex raised a dispute on "Marathon Time" bet',
    data: { betId: '127', userId: 'alex' }
  },
  {
    type: 'bet-resolved',
    title: 'Bet Resolved',
    message: 'You won the bet "World Cup Winner"!',
    data: { betId: '128' }
  },
  {
    type: 'bet-cancel-request',
    title: 'Cancellation Request',
    message: 'Sarah requested to cancel the "Weight Loss" bet',
    data: { betId: '129', userId: 'sarah' }
  },
  {
    type: 'bet-cancelled',
    title: 'Bet Cancelled',
    message: 'The bet "Movie Release Date" has been cancelled',
    data: { betId: '130' }
  },
  {
    type: 'comment',
    title: 'New Comment',
    message: 'Tom commented on your bet: "This is interesting!"',
    data: { betId: '131', userId: 'tom', commentId: '456' }
  },
  {
    type: 'like',
    title: 'New Like',
    message: 'Emma liked your bet "First Snow of Winter"',
    data: { betId: '132', userId: 'emma' }
  },
  {
    type: 'bookmark',
    title: 'Bet Bookmarked',
    message: 'Someone bookmarked your "Crypto Price" bet',
    data: { betId: '133' }
  },
  {
    type: 'share',
    title: 'Bet Shared',
    message: 'Chris shared your bet "Election Winner"',
    data: { betId: '134', userId: 'chris' }
  }
]

io.on('connection', (socket) => {
  console.log('Client connected')

  // Send a test notification immediately
  const initialNotification = notifications[0]
  socket.emit('notification', {
    id: uuidv4(),
    ...initialNotification,
    timestamp: new Date().toISOString(),
    read: false
  })

  // Send a random notification every 15 seconds
  const interval = setInterval(() => {
    const notification = notifications[Math.floor(Math.random() * notifications.length)]
    socket.emit('notification', {
      id: uuidv4(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    })
  }, 15000)

  socket.on('disconnect', () => {
    clearInterval(interval)
    console.log('Client disconnected')
  })
})

httpServer.listen(3001, () => {
  console.log('Socket.IO server running on port 3001')
}) 