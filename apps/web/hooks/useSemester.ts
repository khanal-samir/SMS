import { useQuery } from '@tanstack/react-query'
import { semesterApi } from '@/apis/semester.api'
import { QUERY_KEYS } from '@/lib/query-keys'

export const useSemesters = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEMESTERS],
    queryFn: async () => {
      const response = await semesterApi.getAllSemesters()
      return response.data
    },
  })
}

export const useSemester = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEMESTER, id],
    queryFn: async () => {
      const response = await semesterApi.getSemesterById(id)
      return response.data
    },
    enabled: !!id,
  })
}
