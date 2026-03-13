'use client'

import { useParams } from 'next/navigation'
import { Loader2, Code, Users } from 'lucide-react'
import { useSubject, useSubjectTeachers } from '@/hooks/useSubject'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { StatCards } from '@/components/ui/stat-cards'
import { FeatureCards } from '@/components/ui/feature-cards'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/teacher/subjects', label: 'All Subjects' }}
          title={subject.subjectName}
          description={subject.subjectCode}
        />

        <StatCards
          stats={[
            { label: 'Subject Code', value: subject.subjectCode, icon: Code },
            { label: 'Co-Teachers', value: teachers?.length ?? 0, icon: Users },
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Assigned Teachers</CardTitle>
            <CardDescription>Other teachers working on this subject.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTeachers ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : teachers && teachers.length > 0 ? (
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6">Teacher</TableHead>
                      <TableHead className="px-6">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="px-6 font-medium text-foreground">
                          {assignment.teacher.name}
                        </TableCell>
                        <TableCell className="px-6 text-sm text-muted-foreground">
                          {assignment.teacher.email}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No teachers assigned.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          <FeatureCards assignmentsHref="/teacher/assignments" resourcesHref="/teacher/resources" />
        </div>
      </div>
    </div>
  )
}
