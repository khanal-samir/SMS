import apiClient from '@/lib/api'
import type { ApiResponse, SubjectResponse, SubjectTeacherResponse } from '@repo/schemas'

export const subjectApi = {
  getAllSubjects: async (): Promise<ApiResponse<SubjectResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<SubjectResponse[]>>('/subjects')
    return data
  },

  getSubjectsBySemester: async (semesterId: string): Promise<ApiResponse<SubjectResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<SubjectResponse[]>>(
      `/subjects/semester/${semesterId}`,
    )
    return data
  },

  getSubjectById: async (id: string): Promise<ApiResponse<SubjectResponse>> => {
    const { data } = await apiClient.get<ApiResponse<SubjectResponse>>(`/subjects/${id}`)
    return data
  },

  getSubjectTeachers: async (id: string): Promise<ApiResponse<SubjectTeacherResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<SubjectTeacherResponse[]>>(
      `/subjects/${id}/teachers`,
    )
    return data
  },
}
