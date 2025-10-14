import Cookies from 'js-cookie'
import { Role } from '@repo/schemas'
export const COOKIE_NAMES = {
  SESSION: 'user-session',
} as const

export interface SessionCookie {
  userId: string
  role: Role
  isAuthenticated: boolean
}

export function setSessionCookie(data: SessionCookie): void {
  Cookies.set(COOKIE_NAMES.SESSION, JSON.stringify(data), {
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
    return JSON.parse(cookieValue)
  } catch {
    return null
  }
}

export function updateSessionCookie(data: Partial<SessionCookie>) {
  const currentSession = getSessionCookie()
  if (!currentSession) return
  const updatedSession = { ...currentSession, ...data }
  setSessionCookie(updatedSession)
}
