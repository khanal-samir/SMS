'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Provider, Role } from '@repo/schemas'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, setLoading } = useAuthStore()

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

      // Get tokens and user data from URL parameters
      const accessToken = searchParams.get('accessToken')
      const refreshToken = searchParams.get('refreshToken')
      const userId = searchParams.get('userId')
      const email = searchParams.get('email')
      const name = searchParams.get('name')
      const role = searchParams.get('role')
      const provider = searchParams.get('provider')

      if (!accessToken || !refreshToken || !userId || !email || !name || !role || !provider) {
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
        refreshToken,
      }

      login(userData, accessToken)
      toast.success('Successfully logged in with Google!')

      setLoading(false)
      router.push('/dashboard')
    }

    handleCallback()
  }, [searchParams, router, login, setLoading])

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
