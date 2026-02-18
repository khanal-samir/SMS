import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assignmentApi } from '@/apis/assignment.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { toast } from 'sonner'
import type {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  UpdateAssignmentStatusDto,
} from '@repo/schemas'

export const useAssignments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ASSIGNMENTS],
    queryFn: async () => {
      const response = await assignmentApi.getAllAssignments()
      return response.data
    },
  })
}

export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ASSIGNMENT, id],
    queryFn: async () => {
      const response = await assignmentApi.getAssignment(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useTeacherSubjects = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEACHER_SUBJECTS],
    queryFn: async () => {
      const response = await assignmentApi.getTeacherSubjects()
      return response.data
    },
  })
}

export const useAllSubjectTeachers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_SUBJECT_TEACHERS],
    queryFn: async () => {
      const response = await assignmentApi.getAllSubjectTeachers()
      return response.data
    },
  })
}

export const useCreateAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateAssignmentDto) => assignmentApi.createAssignment(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSIGNMENTS] })
      toast.success(data.message)
    },
  })
}

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAssignmentDto }) =>
      assignmentApi.updateAssignment(id, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSIGNMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSIGNMENT, variables.id] })
      toast.success(data.message)
    },
  })
}

export const useUpdateAssignmentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAssignmentStatusDto }) =>
      assignmentApi.updateAssignmentStatus(id, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSIGNMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSIGNMENT, variables.id] })
      toast.success(data.message)
    },
  })
}

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => assignmentApi.deleteAssignment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSIGNMENTS] })
      toast.success(data.message)
    },
  })
}
