import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resourceApi } from '@/apis/resource.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { toast } from 'sonner'
import type { CreateResourceDto, UpdateResourceDto, CreateResourceResponse } from '@repo/schemas'

export const useResources = (subjectId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESOURCES, subjectId],
    queryFn: async () => {
      const response = await resourceApi.getAllResources(subjectId)
      return response.data
    },
  })
}

export const useResource = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESOURCE, id],
    queryFn: async () => {
      const response = await resourceApi.getResource(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useTeacherSubjectsForResource = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESOURCE_TEACHER_SUBJECTS],
    queryFn: async () => {
      const response = await resourceApi.getTeacherSubjects()
      return response.data
    },
  })
}

export const useAllSubjectTeachersForResource = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESOURCE_ALL_SUBJECT_TEACHERS],
    queryFn: async () => {
      const response = await resourceApi.getAllSubjectTeachers()
      return response.data
    },
  })
}

/**
 * Creates a resource using the 3-step presigned URL flow:
 * 1. POST /resources → create DB record + get presigned URL
 * 2. PUT file directly to S3 using presigned URL
 * 3. PATCH /resources/:id/confirm → mark as uploaded
 */
export const useCreateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ dto, file }: { dto: CreateResourceDto; file?: File }) => {
      // Step 1: Create resource record and get presigned upload URL
      const createResponse = await resourceApi.createResource(dto)
      const responseData = createResponse.data

      if (!responseData) {
        throw new Error('Failed to create resource')
      }

      const { resource, uploadUrl } = responseData

      // Step 2: Upload file to S3 (for DOCUMENT and IMAGE types)
      if (uploadUrl && file && dto.mimeType) {
        await resourceApi.uploadFileToS3(uploadUrl, file, dto.mimeType)

        // Step 3: Confirm upload
        await resourceApi.confirmUpload(resource.id)
      }

      return createResponse
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] })
      toast.success(data.message)
    },
    onError: () => {
      toast.error('Failed to create resource')
    },
  })
}

export const useUpdateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateResourceDto }) =>
      resourceApi.updateResource(id, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCE, variables.id] })
      toast.success(data.message)
    },
  })
}

export const useDeleteResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => resourceApi.deleteResource(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCES] })
      toast.success(data.message)
    },
  })
}

export const useDownloadResource = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await resourceApi.getDownloadUrl(id)
      return response.data
    },
    onSuccess: (data) => {
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank')
      }
    },
    onError: () => {
      toast.error('Failed to generate download link')
    },
  })
}
