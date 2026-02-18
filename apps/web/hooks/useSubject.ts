import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subjectApi } from '@/apis/subject.api'
import { userApi } from '@/apis/user.api'
import { QUERY_KEYS } from '@/lib/query-keys'
import { toast } from 'sonner'
import type { AssignTeacherSubjectDto } from '@repo/schemas'

export const useSubjects = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBJECTS],
    queryFn: async () => {
      const response = await subjectApi.getAllSubjects()
      return response.data
    },
  })
}

export const useSemesterSubjects = (semesterId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEMESTER_SUBJECTS, semesterId],
    queryFn: async () => {
      const response = await subjectApi.getSubjectsBySemester(semesterId)
      return response.data
    },
    enabled: !!semesterId,
  })
}

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBJECT, id],
    queryFn: async () => {
      const response = await subjectApi.getSubjectById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useSubjectTeachers = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBJECT_TEACHERS, id],
    queryFn: async () => {
      const response = await subjectApi.getSubjectTeachers(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useAssignTeacher = (subjectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: AssignTeacherSubjectDto) => userApi.assignTeacherSubject(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBJECT_TEACHERS, subjectId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEMESTER] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEMESTERS] })
      toast.success(data.message)
    },
  })
}

export const useUnassignTeacher = (subjectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: AssignTeacherSubjectDto) => userApi.unassignTeacherSubject(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBJECT_TEACHERS, subjectId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEMESTER] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEMESTERS] })
      toast.success(data.message)
    },
  })
}
