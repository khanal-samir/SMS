import apiClient from '@/lib/api'
import type { ApiResponse, ChatGroup, ChatMessagePage } from '@repo/schemas'

export const chatApi = {
  getGroups: async (): Promise<ApiResponse<ChatGroup[]>> => {
    const { data } = await apiClient.get<ApiResponse<ChatGroup[]>>('/chat/groups')
    return data
  },

  getMessages: async (
    groupId: string,
    cursor?: string,
    limit?: number,
  ): Promise<ApiResponse<ChatMessagePage>> => {
    const params = new URLSearchParams()
    if (cursor) params.set('cursor', cursor)
    if (limit) params.set('limit', String(limit))

    const query = params.toString()
    const url = `/chat/groups/${groupId}/messages${query ? `?${query}` : ''}`

    const { data } = await apiClient.get<ApiResponse<ChatMessagePage>>(url)
    return data
  },
}
