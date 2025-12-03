'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Provider, Role } from '@repo/schemas'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'

function LoadingCard() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Authenticating...</CardTitle>
          <CardDescription>Please wait while we log you in with Google</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <GoogleCallbackHandler />
    </Suspense>
  )
}

function GoogleCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, setLoading } = useAuthStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleCallback = () => {
      setLoading(true)

      const error = searchParams.get('error')
      if (error) {
        toast.error(error || 'Authentication failed')
        setLoading(false)
        router.push('/login')
        return
      }

      // Get user data from URL parameters (cookies already set by backend)
      const userId = searchParams.get('userId')
      const email = searchParams.get('email')
      const name = searchParams.get('name')
      const role = searchParams.get('role')
      const provider = searchParams.get('provider')

      if (!userId || !email || !name || !role || !provider) {
        toast.error('Invalid authentication response')
        setLoading(false)
        router.push('/login')
        return
      }

      const userData = {
        id: userId,
        email: decodeURIComponent(email),
        name: decodeURIComponent(name),
        role: role as Role,
        provider: provider as Provider,
      }

      setUser(userData)
      // Invalidate to refetch fresh user data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] })
      toast.success('Successfully logged in with Google!')

      setLoading(false)

      if (role === 'STUDENT') {
        router.push('/student/dashboard')
      } else if (role === 'TEACHER') {
        router.push('/teacher/dashboard')
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    }

    handleCallback()
  }, [searchParams, router, setUser, setLoading, queryClient])

  return <LoadingCard />
}
