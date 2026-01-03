import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/api/user.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { toast } from 'sonner'

export const usePendingTeachers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PENDING_TEACHERS],
    queryFn: async () => {
      const response = await userApi.getPendingTeachers()
      return response.data || []
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export const useApproveTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (teacherId: string) => userApi.approveTeacher(teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_TEACHERS] })
      toast.success('Teacher approved successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve teacher')
    },
  })
}

