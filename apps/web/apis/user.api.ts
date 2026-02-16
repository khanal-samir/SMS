import apiClient from '@/lib/api'
import type {
  AllUsersResponse,
  ApiResponse,
  AssignTeacherSubjectDto,
  StudentDetailResponse,
  User,
} from '@repo/schemas'

export const userApi = {
  getPendingTeachers: async (): Promise<ApiResponse<User[]>> => {
    const { data } = await apiClient.get<ApiResponse<User[]>>('/user/pending-teachers')
    return data
  },

  approveTeacher: async (teacherId: string): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.put<ApiResponse<User>>(`/user/approve-teachers/${teacherId}`)
    return data
  },

  getApprovedTeachers: async (): Promise<ApiResponse<User[]>> => {
    const { data } = await apiClient.get<ApiResponse<User[]>>('/user/approved-teachers')
    return data
  },

  assignTeacherSubject: async (dto: AssignTeacherSubjectDto): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>('/user/assign-teacher-subject', dto)
    return data
  },

  unassignTeacherSubject: async (dto: AssignTeacherSubjectDto): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>(
      '/user/unassign-teacher-subject',
      dto,
    )
    return data
  },

  getAllUsers: async (): Promise<ApiResponse<AllUsersResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<AllUsersResponse[]>>('/user/all')
    return data
  },

  getStudentDetail: async (id: string): Promise<ApiResponse<StudentDetailResponse>> => {
    const { data } = await apiClient.get<ApiResponse<StudentDetailResponse>>(`/user/student/${id}`)
    return data
  },

  getMyStudentDetail: async (): Promise<ApiResponse<StudentDetailResponse>> => {
    const { data } = await apiClient.get<ApiResponse<StudentDetailResponse>>('/user/student/me')
    return data
  },
}
