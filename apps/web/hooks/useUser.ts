import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/apis/user.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { RoleEnum } from '@repo/schemas'
import { toast } from 'sonner'

export const useAllUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_USERS],
    queryFn: async () => {
      const response = await userApi.getAllUsers()
      return response.data
    },
  })
}

export const useUsersByRole = () => {
  const { data: users, ...rest } = useAllUsers()

  const teachers = users?.filter((user) => user.role === RoleEnum.enum.TEACHER) ?? []
  const students = users?.filter((user) => user.role === RoleEnum.enum.STUDENT) ?? []
  const admins = users?.filter((user) => user.role === RoleEnum.enum.ADMIN) ?? []

  return {
    ...rest,
    users,
    teachers,
    students,
    admins,
  }
}

export const useStudentDetail = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENT_DETAIL, id],
    queryFn: async () => {
      const response = await userApi.getStudentDetail(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useMyStudentDetail = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENT_DETAIL, 'me'],
    queryFn: async () => {
      const response = await userApi.getMyStudentDetail()
      return response.data
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => userApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_USERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENT_DETAIL] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBJECT_TEACHERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEMESTER] })
      toast.success('User deleted successfully')
    },
  })
}
