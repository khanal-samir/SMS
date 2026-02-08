import apiClient from '@/lib/api'
import { User } from '@repo/schemas'
import type { ApiResponse } from '@repo/schemas'

export const userApi = {
  getPendingTeachers: async (): Promise<ApiResponse<User[]>> => {
    const { data } = await apiClient.get<ApiResponse<User[]>>('/user/pending-teachers')
    return data
  },

  approveTeacher: async (teacherId: string): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.put<ApiResponse<User>>(`/user/approve-teachers/${teacherId}`)
    return data
  },
}
