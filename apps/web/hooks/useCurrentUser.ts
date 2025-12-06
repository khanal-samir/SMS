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
        const response = await authApi.getCurrentUser()
        if (!response.data) {
          throw new Error('Failed to fetch current user')
        }
        setUser(response.data)
        return response.data
      } catch (error) {
        clearUser()
        throw error
      }
    },
    enabled: !!sessionCookie?.isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, //user data rarely changes
  })

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
