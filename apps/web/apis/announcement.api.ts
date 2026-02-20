import apiClient from '@/lib/api'
import type {
  ApiResponse,
  AnnouncementResponse,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '@repo/schemas'

export const announcementApi = {
  getAllAnnouncements: async (): Promise<ApiResponse<AnnouncementResponse[]>> => {
    const { data } = await apiClient.get<ApiResponse<AnnouncementResponse[]>>('/announcements')
    return data
  },

  getAnnouncement: async (id: string): Promise<ApiResponse<AnnouncementResponse>> => {
    const { data } = await apiClient.get<ApiResponse<AnnouncementResponse>>(`/announcements/${id}`)
    return data
  },

  createAnnouncement: async (
    dto: CreateAnnouncementDto,
  ): Promise<ApiResponse<AnnouncementResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AnnouncementResponse>>('/announcements', dto)
    return data
  },

  updateAnnouncement: async (
    id: string,
    dto: UpdateAnnouncementDto,
  ): Promise<ApiResponse<AnnouncementResponse>> => {
    const { data } = await apiClient.patch<ApiResponse<AnnouncementResponse>>(
      `/announcements/${id}`,
      dto,
    )
    return data
  },

  deleteAnnouncement: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const { data } = await apiClient.delete<ApiResponse<{ id: string }>>(`/announcements/${id}`)
    return data
  },

  markAsRead: async (id: string): Promise<ApiResponse<{ announcementId: string }>> => {
    const { data } = await apiClient.post<ApiResponse<{ announcementId: string }>>(
      `/announcements/${id}/read`,
    )
    return data
  },
}
