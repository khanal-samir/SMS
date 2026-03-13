import apiClient from '@/lib/api'
import type {
  ApiResponse,
  StudentDashboardResponse,
  TeacherDashboardResponse,
  AdminDashboardResponse,
} from '@repo/schemas'

export const dashboardApi = {
  getStudentDashboard: async (): Promise<ApiResponse<StudentDashboardResponse>> => {
    const { data } =
      await apiClient.get<ApiResponse<StudentDashboardResponse>>('/dashboard/student')
    return data
  },

  getTeacherDashboard: async (): Promise<ApiResponse<TeacherDashboardResponse>> => {
    const { data } =
      await apiClient.get<ApiResponse<TeacherDashboardResponse>>('/dashboard/teacher')
    return data
  },

  getAdminDashboard: async (): Promise<ApiResponse<AdminDashboardResponse>> => {
    const { data } = await apiClient.get<ApiResponse<AdminDashboardResponse>>('/dashboard/admin')
    return data
  },
}
