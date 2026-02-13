import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/apis/user.api'
import { QUERY_KEYS } from '@/lib/query-keys'

export const useApprovedTeachers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPROVED_TEACHERS],
    queryFn: async () => {
      const response = await userApi.getApprovedTeachers()
      return response.data
    },
  })
}
