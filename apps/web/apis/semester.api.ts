import apiClient from '@/lib/api'
import type { ApiResponse, SemesterDetailResponse, SemesterResponse } from '@repo/schemas'

export const semesterApi = {
  getAllSemesters: async (): Promise<ApiResponse<SemesterResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<SemesterResponse[]>>('/semesters')
    return data
  },

  getSemesterById: async (id: string): Promise<ApiResponse<SemesterDetailResponse>> => {
    const { data } = await apiClient.get<ApiResponse<SemesterDetailResponse>>(`/semesters/${id}`)
    return data
  },
}
