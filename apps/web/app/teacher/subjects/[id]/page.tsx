'use client'

import { useParams } from 'next/navigation'
import { Loader2, Code, Users } from 'lucide-react'
import { useSubject, useSubjectTeachers } from '@/hooks/useSubject'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { StatsStrip } from '@/components/dashboard/stats-strip'
import { FeatureCards } from '@/components/ui/feature-cards'
import { ContentSection } from '@/components/dashboard/content-section'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TeacherSubjectDetailPage() {
  const params = useParams()
  const subjectId = params.id as string

  const { data: subject, isLoading: isLoadingSubject } = useSubject(subjectId)
  const { data: teachers, isLoading: isLoadingTeachers } = useSubjectTeachers(subjectId)

  if (isLoadingSubject) {
    return <LoadingState />
  }

  if (!subject) {
    return (
      <NotFoundState
        title="Subject Not Found"
        message="The subject you're looking for could not be found."
        backButton={{ href: '/teacher/subjects', label: 'Back to Subjects' }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/teacher/subjects', label: 'All Subjects' }}
          title={subject.subjectName}
          description={subject.subjectCode}
        />

        <StatsStrip
          stats={[
            {
              label: 'Subject Code',
              value: subject.subjectCode,
              icon: Code,
              iconColor: 'text-primary',
              iconBg: 'bg-primary/10',
            },
            {
              label: 'Co-Teachers',
              value: teachers?.length ?? 0,
              icon: Users,
              iconColor: 'text-info',
              iconBg: 'bg-info/10',
            },
          ]}
        />

        <ContentSection
          icon={Users}
          title="Assigned teachers"
          description="Other teachers working on this subject."
          className="mt-10"
        >
          {isLoadingTeachers ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : teachers && teachers.length > 0 ? (
            <div className="card-elevated overflow-hidden">
              <Table className="table-clean">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Teacher</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium text-foreground">
                        {assignment.teacher.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {assignment.teacher.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="card-elevated py-10 text-center">
              <p className="text-sm text-muted-foreground">No teachers assigned.</p>
            </div>
          )}
        </ContentSection>

        <div className="mt-10">
          <FeatureCards assignmentsHref="/teacher/assignments" resourcesHref="/teacher/resources" />
        </div>
      </div>
    </div>
  )
}
