'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSemesters } from '@/hooks/useSemester'
import { useSubjects } from '@/hooks/useSubject'

import { PageHeader } from '@/components/ui/page-header'
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/student/dashboard', label: 'Dashboard' }}
          title="My Courses"
          description="Current semester subjects and schedule"
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
                <p className="text-sm text-muted-foreground tabular-nums">
                  {semesterSubjects.length} subject{semesterSubjects.length === 1 ? '' : 's'}{' '}
                  enrolled
                </p>
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
                        className="flex flex-col rounded-lg border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md cursor-pointer"
                        onClick={() => router.push(`/student/courses/${subject.id}`)}
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {subject.subjectCode}
                        </span>
                        <span className="text-sm text-muted-foreground">{subject.subjectName}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No subjects found for this semester.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="rounded-lg border bg-card py-16 text-center shadow-sm">
            <p className="text-muted-foreground">No current semester assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
