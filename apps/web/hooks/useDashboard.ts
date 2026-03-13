import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard.api'
import { QUERY_KEYS } from '@/lib/query-keys'

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENT_DASHBOARD],
    queryFn: async () => {
      const response = await dashboardApi.getStudentDashboard()
      return response.data
    },
  })
}

export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEACHER_DASHBOARD],
    queryFn: async () => {
      const response = await dashboardApi.getTeacherDashboard()
      return response.data
    },
  })
}

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD],
    queryFn: async () => {
      const response = await dashboardApi.getAdminDashboard()
      return response.data
    },
  })
}
