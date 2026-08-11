import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getRoleFromToken(token: string): 'supervisor' | 'worker' | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    return payload.role || null
  } catch (err) {
    return null
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const role = token ? getRoleFromToken(token) : null
  const { pathname } = request.nextUrl

  // Redirect logged in users away from /login to their dashboard
  if (pathname === '/login') {
    if (role === 'supervisor') {
      return NextResponse.redirect(new URL('/supervisor/dashboard', request.url))
    }
    if (role === 'worker') {
      return NextResponse.redirect(new URL('/worker/dashboard', request.url))
    }
  }

  // Protected Supervisor Routes
  if (pathname.startsWith('/supervisor')) {
    if (!token || role !== 'supervisor') {
      if (role === 'worker') {
        return NextResponse.redirect(new URL('/worker/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/login?role=supervisor', request.url))
    }
  }

  // Protected Worker Routes
  if (pathname.startsWith('/worker')) {
    if (!token || role !== 'worker') {
      if (role === 'supervisor') {
        return NextResponse.redirect(new URL('/supervisor/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/login?role=worker', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/supervisor/:path*', '/worker/:path*', '/login'],
}

