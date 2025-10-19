import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getSessionCookie } from '@/lib/session'

export const useCurrentUser = () => {
  const { setUser, clearUser } = useAuthStore()
  const sessionCookie = getSessionCookie()

  const query = useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: async () => {
      try {
        const data = await authApi.getCurrentUser()
        setUser(data)
        return data
      } catch (error) {
        clearUser()
        throw error
      }
    },
    enabled: !!sessionCookie?.isAuthenticated,
    retry: false,
  })

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
