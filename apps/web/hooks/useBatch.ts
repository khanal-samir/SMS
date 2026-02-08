import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { batchApi } from '@/api/batch.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { toast } from 'sonner'
import type { CreateBatchDto, EnrollStudentDto } from '@repo/schemas'

export const useBatches = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BATCHES],
    queryFn: async () => {
      const response = await batchApi.getAllBatches()
      return response.data
    },
    staleTime: 30 * 1000,
  })
}

export const useBatch = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BATCH, id],
    queryFn: async () => {
      const response = await batchApi.getBatchById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useBatchStudents = (batchId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BATCH_STUDENTS, batchId],
    queryFn: async () => {
      const response = await batchApi.getBatchStudents(batchId)
      return response.data
    },
    enabled: !!batchId,
  })
}

export const useUnenrolledStudents = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.UNENROLLED_STUDENTS],
    queryFn: async () => {
      const response = await batchApi.getUnenrolledStudents()
      return response.data
    },
  })
}

export const useCreateBatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateBatchDto) => batchApi.createBatch(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATCHES] })
      toast.success(data.message)
    },
  })
}

export const useEnrollStudent = (batchId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: EnrollStudentDto) => batchApi.enrollStudent(batchId, dto),
    onSuccess: (data) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATCH_STUDENTS, batchId] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATCHES] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATCH, batchId] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNENROLLED_STUDENTS] }),
      ])
      toast.success(data.message)
    },
  })
}

export const useAdvanceSemester = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (batchId: string) => batchApi.advanceSemester(batchId),
    onSuccess: (data, batchId) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATCHES] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATCH, batchId] }),
      ])
      toast.success(data.message)
    },
  })
}
