import { NextResponse } from 'next/server'
import SocketHandler from '@/server/socket'

export async function GET(req: Request) {
  // @ts-ignore - req and res are needed for socket.io
  await SocketHandler(req, new NextResponse())
  return new NextResponse('Socket is running')
} 