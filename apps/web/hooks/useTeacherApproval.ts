import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/apis/user.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { toast } from 'sonner'

export const usePendingTeachers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PENDING_TEACHERS],
    queryFn: async () => {
      const response = await userApi.getPendingTeachers()
      return response.data
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export const useApproveTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (teacherId: string) => userApi.approveTeacher(teacherId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_TEACHERS] })
      toast.success(data.message)
    },
  })
}
