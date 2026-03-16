import apiClient from '@/lib/api'
import type {
  ApiResponse,
  ResourceResponse,
  CreateResourceDto,
  UpdateResourceDto,
  CreateResourceResponse,
  TeacherSubjectRecord,
  AllSubjectTeacherRecord,
} from '@repo/schemas'

export const resourceApi = {
  getAllResources: async (subjectId?: string): Promise<ApiResponse<ResourceResponse[]>> => {
    const params = subjectId ? { subjectId } : undefined
    const { data } = await apiClient.get<ApiResponse<ResourceResponse[]>>('/resources', { params })
    return data
  },

  getResource: async (id: string): Promise<ApiResponse<ResourceResponse>> => {
    const { data } = await apiClient.get<ApiResponse<ResourceResponse>>(`/resources/${id}`)
    return data
  },

  createResource: async (dto: CreateResourceDto): Promise<ApiResponse<CreateResourceResponse>> => {
    const { data } = await apiClient.post<ApiResponse<CreateResourceResponse>>('/resources', dto)
    return data
  },

  confirmUpload: async (id: string): Promise<ApiResponse<ResourceResponse>> => {
    const { data } = await apiClient.patch<ApiResponse<ResourceResponse>>(
      `/resources/${id}/confirm`,
    )
    return data
  },

  updateResource: async (
    id: string,
    dto: UpdateResourceDto,
  ): Promise<ApiResponse<ResourceResponse>> => {
    const { data } = await apiClient.patch<ApiResponse<ResourceResponse>>(`/resources/${id}`, dto)
    return data
  },

  deleteResource: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const { data } = await apiClient.delete<ApiResponse<{ id: string }>>(`/resources/${id}`)
    return data
  },

  getDownloadUrl: async (id: string): Promise<ApiResponse<{ downloadUrl: string }>> => {
    const { data } = await apiClient.get<ApiResponse<{ downloadUrl: string }>>(
      `/resources/${id}/download`,
    )
    return data
  },

  getTeacherSubjects: async (): Promise<ApiResponse<TeacherSubjectRecord[]>> => {
    const { data } =
      await apiClient.get<ApiResponse<TeacherSubjectRecord[]>>('/resources/my-subjects')
    return data
  },

  getAllSubjectTeachers: async (): Promise<ApiResponse<AllSubjectTeacherRecord[]>> => {
    const { data } = await apiClient.get<ApiResponse<AllSubjectTeacherRecord[]>>(
      '/resources/all-subject-teachers',
    )
    return data
  },

  /**
   * Upload a file directly to S3 using a presigned PUT URL.
   * Uses native fetch instead of axios to bypass the API auth interceptor.
   */
  uploadFileToS3: async (presignedUrl: string, file: File, contentType: string): Promise<void> => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to upload file to storage')
    }
  },
}
