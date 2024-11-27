import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/signin') || 
                    request.nextUrl.pathname.startsWith('/register')

  if (!token && !isAuthPage) {
    // Redirect unauthenticated users to signin page
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  if (token && isAuthPage) {
    // Redirect authenticated users to home page if they try to access signin/register
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 