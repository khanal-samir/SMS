import apiClient from '@/lib/api'
import type {
  ApiResponse,
  ChatGroup,
  ChatMessagePage,
  GetChatMessagesQueryDto,
} from '@repo/schemas'

export const chatApi = {
  getGroups: async (): Promise<ApiResponse<ChatGroup[]>> => {
    const { data } = await apiClient.get<ApiResponse<ChatGroup[]>>('/chat/groups')
    return data
  },

  getMessages: async (
    query: GetChatMessagesQueryDto & { groupId: string },
  ): Promise<ApiResponse<ChatMessagePage>> => {
    const params = new URLSearchParams()
    if (query.cursor) params.set('cursor', query.cursor)
    if (query.limit) params.set('limit', String(query.limit))
    const url = `/chat/groups/${query.groupId}/messages${params.toString() ? `?${params.toString()}` : ''}`

    const { data } = await apiClient.get<ApiResponse<ChatMessagePage>>(url)
    return data
  },
}
