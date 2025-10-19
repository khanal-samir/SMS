import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SessionCookie } from './lib/session'
import { Role } from '@repo/schemas'

interface RouteConfig {
  pattern: string | RegExp
  allowedRoles?: Role[]
  isPublic?: boolean
  isAuthRoute?: boolean
}

const ROUTE_CONFIG: RouteConfig[] = [
  // Public routes
  { pattern: '/', isPublic: true },
  { pattern: '/forgot-password', isPublic: true },
  { pattern: '/auth/google/callback', isPublic: true },

  // Student auth routes
  { pattern: '/login', isPublic: true, isAuthRoute: true },
  { pattern: '/register', isPublic: true, isAuthRoute: true },

  // Teacher auth routes
  { pattern: '/teacher/login', isPublic: true, isAuthRoute: true },
  { pattern: '/teacher/register', isPublic: true, isAuthRoute: true },

  // Role-based routes
  { pattern: /^\/admin($|\/)/, allowedRoles: ['ADMIN'] },
  { pattern: /^\/teacher\/(?!login|register)/, allowedRoles: ['TEACHER', 'ADMIN'] }, // Exclude login/register
  { pattern: /^\/student($|\/)/, allowedRoles: ['STUDENT', 'ADMIN'] },
]

const ROLE_REDIRECTS: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  TEACHER: '/teacher/dashboard',
  STUDENT: '/student/dashboard',
}

function matchRoute(pathname: string, pattern: string | RegExp): boolean {
  if (typeof pattern === 'string') {
    return pathname === pattern || pathname.startsWith(`${pattern}/`)
  }
  return pattern.test(pathname)
}

function findRouteConfig(pathname: string): RouteConfig | undefined {
  return ROUTE_CONFIG.find((config) => matchRoute(pathname, config.pattern))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionCookie = request.cookies.get('user-session') //client-side
  const accessToken = request.cookies.get('accessToken')
  const refreshToken = request.cookies.get('refreshToken')

  const hasBackendAuth = !!accessToken || !!refreshToken

  let session: SessionCookie | null = null

  if (sessionCookie?.value) {
    try {
      session = JSON.parse(sessionCookie.value) as SessionCookie

      if (session.expiresAt && Date.now() > session.expiresAt) {
        session = null
      }
    } catch {
      session = null
    }
  }

  const isAuthenticated = session?.isAuthenticated && hasBackendAuth
  const userRole = session?.role

  // If session cookie exists but no backend tokens, clear it and redirect
  if (session?.isAuthenticated && !hasBackendAuth) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('user-session')
    return response
  }

  const routeConfig = findRouteConfig(pathname)

  if (!routeConfig) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  if (routeConfig.isPublic) {
    if (isAuthenticated && routeConfig.isAuthRoute && userRole) {
      return NextResponse.redirect(new URL(ROLE_REDIRECTS[userRole], request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (routeConfig.allowedRoles && userRole) {
    if (!routeConfig.allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL(ROLE_REDIRECTS[userRole], request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
