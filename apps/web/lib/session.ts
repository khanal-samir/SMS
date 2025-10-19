import Cookies from 'js-cookie'
import { Role } from '@repo/schemas'
export const COOKIE_NAMES = {
  SESSION: 'user-session',
} as const

export interface SessionCookie {
  role: Role
  isAuthenticated: boolean
  expiresAt: number
}

export function setSessionCookie(data: Omit<SessionCookie, 'expiresAt'>): void {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  const sessionData: SessionCookie = {
    ...data,
    expiresAt,
  }
  Cookies.set(COOKIE_NAMES.SESSION, JSON.stringify(sessionData), {
    expires: 7,
    sameSite: 'lax',
    path: '/',
  })
}

export function removeSessionCookie() {
  Cookies.remove(COOKIE_NAMES.SESSION, { path: '/' })
}

export function getSessionCookie(): SessionCookie | null {
  const cookieValue = Cookies.get(COOKIE_NAMES.SESSION)
  if (!cookieValue) return null
  try {
    const session = JSON.parse(cookieValue) as SessionCookie

    // Check if session has expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      removeSessionCookie()
      return null
    }

    return session
  } catch {
    removeSessionCookie()
    return null
  }
}

export function updateSessionCookie(data: Partial<SessionCookie>) {
  const currentSession = getSessionCookie()
  if (!currentSession) return
  const updatedSession = { ...currentSession, ...data }
  setSessionCookie(updatedSession)
}
