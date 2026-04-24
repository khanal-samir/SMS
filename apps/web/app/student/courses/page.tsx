'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Loader2 } from 'lucide-react'
import { useSemesters } from '@/hooks/useSemester'
import { useSubjects } from '@/hooks/useSubject'

import { PageHeader } from '@/components/ui/page-header'
import { ContentSection } from '@/components/dashboard/content-section'
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
    <div className="min-h-screen bg-background p-6 lg:p-10">
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
          <ContentSection
            icon={BookOpen}
            title={`${formatSemesterNumber(currentSemester.semesterNumber)} Semester`}
            description={`${semesterSubjects.length} subject${semesterSubjects.length === 1 ? '' : 's'} enrolled`}
          >
            {semesterSubjects.length > 0 ? (
              <div className="card-elevated overflow-hidden">
                <Table className="table-clean">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Code</TableHead>
                      <TableHead>Subject name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semesterSubjects.map((subject) => (
                      <TableRow
                        key={subject.id}
                        className="cursor-pointer"
                        onClick={() => router.push(`/student/courses/${subject.id}`)}
                      >
                        <TableCell className="font-semibold text-foreground">
                          {subject.subjectCode}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {subject.subjectName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="card-elevated py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No subjects found for this semester.
                </p>
              </div>
            )}
          </ContentSection>
        ) : (
          <div className="card-elevated py-16 text-center">
            <p className="text-muted-foreground">No current semester assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
