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
    <div className="min-h-screen bg-background p-6 lg:p-10">
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
          <div className="space-y-10">
            {groupedSubjects.map(({ semester, subjects: semesterSubjects }, index) => (
              <ContentSection
                key={semester.id}
                icon={BookOpen}
                title={`${formatSemesterNumber(semester.semesterNumber)} Semester`}
                description={`${semesterSubjects.length} subject${semesterSubjects.length === 1 ? '' : 's'}`}
                className={index > 0 ? 'mt-10' : undefined}
              >
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
                          onClick={() => router.push(`/teacher/subjects/${subject.id}`)}
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
              </ContentSection>
            ))}
          </div>
        ) : (
          <div className="card-elevated py-16 text-center">
            <p className="text-muted-foreground">No subject assignments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
