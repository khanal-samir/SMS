import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/apis/user.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { RoleEnum } from '@repo/schemas'
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
