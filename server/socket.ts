import { Server as IOServer } from 'socket.io'
import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Socket as NetSocket } from 'net'

export interface SocketServer extends NetServer {
  io?: IOServer
}

export interface SocketWithIO extends NetSocket {
  server: SocketServer
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

let io: IOServer

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket?.server.io) {
    console.log('*First use, starting Socket.IO')
    
    io = new IOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })
    
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id)

      socket.on('bet-request', (data) => {
        console.log('Bet request received:', data)
        socket.broadcast.emit('notification', {
          id: crypto.randomUUID(),
          type: 'bet-request',
          title: 'New Bet Request',
          message: `You received a bet request: ${data.description}`,
          timestamp: new Date().toISOString(),
          read: false,
          data: {
            betId: data.betId,
            userId: data.opponent
          }
        })
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
      })
    })

    res.socket.server.io = io
  }

  res.status(200).json({ success: true })
} 