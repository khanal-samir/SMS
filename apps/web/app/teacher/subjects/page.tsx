'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSemesters } from '@/hooks/useSemester'
import { useSubjects } from '@/hooks/useSubject'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatSemesterNumber } from '@/lib/formatters'

export default function TeacherSubjectsPage() {
  const router = useRouter()
  const { data: semesters, isLoading: isLoadingSemesters } = useSemesters()
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects()

  const groupedSubjects = useMemo(() => {
    if (!semesters || !subjects) return []

    return semesters
      .map((semester) => ({
        semester,
        subjects: subjects.filter((subject) => subject.semesterId === semester.id),
      }))
      .filter((group) => group.subjects.length > 0)
  }, [semesters, subjects])

  const isLoading = isLoadingSemesters || isLoadingSubjects

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/teacher/dashboard', label: 'Dashboard' }}
          title="My Subjects"
          description="Subjects you are currently assigned to"
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : groupedSubjects.length > 0 ? (
          <div className="space-y-6">
            {groupedSubjects.map(({ semester, subjects: semesterSubjects }) => (
              <Card key={semester.id}>
                <CardHeader>
                  <CardTitle>{formatSemesterNumber(semester.semesterNumber)} Semester</CardTitle>
                  <CardDescription>
                    {semesterSubjects.length} subject{semesterSubjects.length === 1 ? '' : 's'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {semesterSubjects.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {semesterSubjects.map((subject) => (
                        <button
                          key={subject.id}
                          type="button"
                          className="flex flex-col rounded-lg border bg-card p-4 text-left transition hover:border-primary/30 hover:shadow-sm"
                          onClick={() => router.push(`/teacher/subjects/${subject.id}`)}
                        >
                          <span className="text-sm font-semibold text-foreground">
                            {subject.subjectCode}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {subject.subjectName}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No subjects assigned for this semester.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card py-16 text-center shadow-sm">
            <p className="text-muted-foreground">No subject assignments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
