import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Protected Supervisor Routes
  if (pathname.startsWith('/supervisor')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?role=supervisor', request.url))
    }
  }

  // Protected Worker Routes
  if (pathname.startsWith('/worker')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?role=worker', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/supervisor/:path*', '/worker/:path*'],
}
