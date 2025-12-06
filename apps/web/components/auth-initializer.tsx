import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAuthStore } from '@/store/auth.store'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthInitializer() {
  const pathname = usePathname()
  const router = useRouter()
  const { clearUser } = useAuthStore()

  const publicRoutes = [
    '/login',
    '/register',
    '/teacher/login',
    '/teacher/register',
    '/auth/google/callback',
    '/',
  ]

  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  const { isError } = useCurrentUser()

  useEffect(() => {
    if (isError && !isPublicRoute) {
      clearUser()
      router.push(`/login?from=${pathname}`)
    }
  }, [isError, isPublicRoute, clearUser, router, pathname])

  return null
}
