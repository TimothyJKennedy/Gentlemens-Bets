import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware function to handle authentication and route protection
export async function middleware(request: NextRequest) {
  // Get the JWT token from the request using next-auth
  const token = await getToken({ req: request })
  
  // Check if the current route is an authentication page (signin or register)
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/signin') || 
                    request.nextUrl.pathname.startsWith('/register')

  // Redirect unauthenticated users to signin page if trying to access protected routes
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Redirect authenticated users away from auth pages if they're already logged in
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next()
}

// Configure which routes should be processed by the middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 