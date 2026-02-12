import apiClient from '@/lib/api'
import type {
  ApiResponse,
  CreateBatchDto,
  EnrollStudentDto,
  BatchResponse,
  UnenrolledStudentResponse,
  BatchDetailResponse,
  BatchEnrolledStudentResponse,
  BatchAdvanceSemesterResponse,
} from '@repo/schemas'

export const batchApi = {
  getAllBatches: async (): Promise<ApiResponse<BatchResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<BatchResponse[]>>('/batches')
    return data
  },

  getBatchById: async (id: string): Promise<ApiResponse<BatchDetailResponse>> => {
    const { data } = await apiClient.get<ApiResponse<BatchDetailResponse>>(`/batches/${id}`)
    return data
  },

  createBatch: async (dto: CreateBatchDto): Promise<ApiResponse<BatchResponse>> => {
    const { data } = await apiClient.post<ApiResponse<BatchResponse>>('/batches', dto)
    return data
  },

  enrollStudent: async (
    batchId: string,
    dto: EnrollStudentDto,
  ): Promise<ApiResponse<BatchEnrolledStudentResponse>> => {
    const { data } = await apiClient.post<ApiResponse<BatchEnrolledStudentResponse>>(
      `/batches/${batchId}/enroll`,
      dto,
    )
    return data
  },

  advanceSemester: async (batchId: string): Promise<ApiResponse<BatchAdvanceSemesterResponse>> => {
    const { data } = await apiClient.post<ApiResponse<BatchAdvanceSemesterResponse>>(
      `/batches/${batchId}/advance-semester`,
    )
    return data
  },

  getBatchStudents: async (
    batchId: string,
  ): Promise<ApiResponse<BatchEnrolledStudentResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<BatchEnrolledStudentResponse[]>>(
      `/batches/${batchId}/students`,
    )
    return data
  },

  getUnenrolledStudents: async (): Promise<ApiResponse<UnenrolledStudentResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<UnenrolledStudentResponse[]>>(
      '/batches/unenrolled-students',
    )
    return data
  },
}
