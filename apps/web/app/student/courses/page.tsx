'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useSemesters } from '@/hooks/useSemester'
import { useSubjects } from '@/hooks/useSubject'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatSemesterNumber } from '@/lib/formatters'

export default function StudentCoursesPage() {
  const router = useRouter()
  const { data: semesters, isLoading: isLoadingSemesters } = useSemesters()
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects()

  const currentSemester = semesters?.[0]
  const semesterSubjects = useMemo(() => {
    if (!currentSemester || !subjects) return []
    return subjects.filter((subject) => subject.semesterId === currentSemester.id)
  }, [currentSemester, subjects])

  const isLoading = isLoadingSemesters || isLoadingSubjects

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/student/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600">Current semester subjects and schedule</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : currentSemester ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {formatSemesterNumber(currentSemester.semesterNumber)} Semester
                </CardTitle>
                <CardDescription>Your current semester</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Semester ID: {currentSemester.id}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>
                  {semesterSubjects.length} subject{semesterSubjects.length === 1 ? '' : 's'} in
                  this semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                {semesterSubjects.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {semesterSubjects.map((subject) => (
                      <button
                        key={subject.id}
                        type="button"
                        className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm"
                        onClick={() => router.push(`/student/courses/${subject.id}`)}
                      >
                        <span className="text-sm font-semibold text-gray-900">
                          {subject.subjectCode}
                        </span>
                        <span className="text-sm text-gray-600">{subject.subjectName}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No subjects found for this semester.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm">
            <p className="text-gray-500">No current semester assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
