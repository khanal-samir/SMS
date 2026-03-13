'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Loader2 } from 'lucide-react'
import { useSemesters } from '@/hooks/useSemester'
import { useSubjects } from '@/hooks/useSubject'

import { PageHeader } from '@/components/ui/page-header'
import { SectionHeader } from '@/components/ui/section-header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
          <section>
            <SectionHeader
              icon={BookOpen}
              title={`${formatSemesterNumber(currentSemester.semesterNumber)} Semester`}
              description={`${semesterSubjects.length} subject${semesterSubjects.length === 1 ? '' : 's'} enrolled`}
            />
            {semesterSubjects.length > 0 ? (
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">Code</TableHead>
                      <TableHead className="px-4">Subject name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semesterSubjects.map((subject) => (
                      <TableRow
                        key={subject.id}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => router.push(`/student/courses/${subject.id}`)}
                      >
                        <TableCell className="px-4 font-semibold text-foreground">
                          {subject.subjectCode}
                        </TableCell>
                        <TableCell className="px-4 text-muted-foreground">
                          {subject.subjectName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No subjects found for this semester.
                </p>
              </div>
            )}
          </section>
        ) : (
          <div className="rounded-lg border py-16 text-center">
            <p className="text-muted-foreground">No current semester assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
