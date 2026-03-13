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
          <div className="space-y-8">
            {groupedSubjects.map(({ semester, subjects: semesterSubjects }) => (
              <section key={semester.id}>
                <SectionHeader
                  icon={BookOpen}
                  title={`${formatSemesterNumber(semester.semesterNumber)} Semester`}
                  description={`${semesterSubjects.length} subject${semesterSubjects.length === 1 ? '' : 's'}`}
                />
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
                          onClick={() => router.push(`/teacher/subjects/${subject.id}`)}
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
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border py-16 text-center">
            <p className="text-muted-foreground">No subject assignments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
