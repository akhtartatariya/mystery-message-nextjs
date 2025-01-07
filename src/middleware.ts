import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  const url = request.nextUrl.pathname
  if (token && (
    url.startsWith('/sign-up') ||
    url.startsWith('/verify') ||
    url.startsWith('/sign-in')
  )) {
    return NextResponse.redirect(new URL('/dashboard',))
  }
  if (!token && url.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-up',
    '/sign-in',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
}