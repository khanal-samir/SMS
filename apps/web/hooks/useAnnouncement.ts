import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { announcementApi } from '@/apis/announcement.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { toast } from 'sonner'
import type { CreateAnnouncementDto, UpdateAnnouncementDto } from '@repo/schemas'

export const useAnnouncements = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANNOUNCEMENTS],
    queryFn: async () => {
      const response = await announcementApi.getAllAnnouncements()
      return response.data
    },
  })
}

export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANNOUNCEMENT, id],
    queryFn: async () => {
      const response = await announcementApi.getAnnouncement(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateAnnouncementDto) => announcementApi.createAnnouncement(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANNOUNCEMENTS] })
      toast.success(data.message)
    },
  })
}

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAnnouncementDto }) =>
      announcementApi.updateAnnouncement(id, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANNOUNCEMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANNOUNCEMENT, variables.id] })
      toast.success(data.message)
    },
  })
}

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => announcementApi.deleteAnnouncement(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANNOUNCEMENTS] })
      toast.success(data.message)
    },
  })
}

export const useMarkAnnouncementAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => announcementApi.markAsRead(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANNOUNCEMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANNOUNCEMENT, id] })
    },
  })
}
