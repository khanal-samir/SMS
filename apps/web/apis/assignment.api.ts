import apiClient from '@/lib/api'
import type {
  ApiResponse,
  AssignmentResponse,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  UpdateAssignmentStatusDto,
} from '@repo/schemas'

export interface TeacherSubjectRecord {
  id: string
  subject: {
    id: string
    subjectCode: string
    subjectName: string
  }
}

export interface AllSubjectTeacherRecord {
  id: string
  subject: {
    id: string
    subjectCode: string
    subjectName: string
  }
  teacher: {
    id: string
    name: string
  }
}

export const assignmentApi = {
  getAllAssignments: async (): Promise<ApiResponse<AssignmentResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<AssignmentResponse[]>>('/assignments')
    return data
  },

  getAssignmentsBySubjectTeacher: async (
    subjectTeacherId: string,
  ): Promise<ApiResponse<AssignmentResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<AssignmentResponse[]>>(
      `/assignments/by-subject-teacher/${subjectTeacherId}`,
    )
    return data
  },

  getAssignment: async (id: string): Promise<ApiResponse<AssignmentResponse>> => {
    const { data } = await apiClient.get<ApiResponse<AssignmentResponse>>(`/assignments/${id}`)
    return data
  },

  createAssignment: async (dto: CreateAssignmentDto): Promise<ApiResponse<AssignmentResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AssignmentResponse>>('/assignments', dto)
    return data
  },

  updateAssignment: async (
    id: string,
    dto: UpdateAssignmentDto,
  ): Promise<ApiResponse<AssignmentResponse>> => {
    const { data } = await apiClient.patch<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}`,
      dto,
    )
    return data
  },

  updateAssignmentStatus: async (
    id: string,
    dto: UpdateAssignmentStatusDto,
  ): Promise<ApiResponse<AssignmentResponse>> => {
    const { data } = await apiClient.patch<ApiResponse<AssignmentResponse>>(
      `/assignments/${id}/status`,
      dto,
    )
    return data
  },

  deleteAssignment: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const { data } = await apiClient.delete<ApiResponse<{ id: string }>>(`/assignments/${id}`)
    return data
  },

  getTeacherSubjects: async (): Promise<ApiResponse<TeacherSubjectRecord[]>> => {
    const { data } = await apiClient.get<ApiResponse<TeacherSubjectRecord[]>>(
      '/assignments/my-subjects',
    )
    return data
  },

  getAllSubjectTeachers: async (): Promise<ApiResponse<AllSubjectTeacherRecord[]>> => {
    const { data } = await apiClient.get<ApiResponse<AllSubjectTeacherRecord[]>>(
      '/assignments/all-subject-teachers',
    )
    return data
  },
}
