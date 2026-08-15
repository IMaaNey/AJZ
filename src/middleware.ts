import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTokenFromReq, verifyToken } from './src/lib/auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // public paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/login') || pathname === '/') return NextResponse.next()

  const token = getTokenFromReq(req as any)
  if (!token) {
    // redirect to login
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  const payload: any = verifyToken(token)
  if (!payload) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // protect admin routes
  if (pathname.startsWith('/admin')) {
    if (payload.role !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // employee routes require at least 'employee' role
  if (pathname.startsWith('/employee')) {
    if (payload.role !== 'employee' && payload.role !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/employee/:path*', '/']
}
