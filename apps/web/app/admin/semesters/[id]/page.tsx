'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSemester } from '@/hooks/useSemester'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { StatCards } from '@/components/ui/stat-cards'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatSemesterNumber } from '@/lib/formatters'
import type { SemesterDetailResponse } from '@repo/schemas'

export default function AdminSemesterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const semesterId = params.id as string

  const { data: semester, isLoading } = useSemester(semesterId)

  if (isLoading) {
    return <LoadingState />
  }

  if (!semester) {
    return (
      <NotFoundState
        title="Semester Not Found"
        message="The semester you're looking for could not be found."
        backButton={{ href: '/admin/semesters', label: 'Back to Semesters' }}
      />
    )
  }

  const semesterLabel = `${formatSemesterNumber(semester.semesterNumber)} Semester`
  const assignedTeachersCount = semester.subjects.reduce(
    (total: number, subject: SemesterDetailResponse['subjects'][number]) =>
      total + subject.subjectTeachers.length,
    0,
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/semesters', label: 'All Semesters' }}
          title={semesterLabel}
          description="Manage subjects and assignments for this semester"
        />

        <StatCards
          stats={[
            { label: 'Semester', value: semesterLabel },
            { label: 'Subjects', value: semester.subjects.length },
            { label: 'Assigned Teachers', value: assignedTeachersCount },
          ]}
          columns={3}
        />

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
            <CardDescription>Click a subject to manage teachers and details.</CardDescription>
          </CardHeader>
          <CardContent>
            {semester.subjects.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6">Code</TableHead>
                      <TableHead className="px-6">Subject</TableHead>
                      <TableHead className="px-6">Teachers</TableHead>
                      <TableHead className="px-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semester.subjects.map(
                      (subject: SemesterDetailResponse['subjects'][number]) => (
                        <TableRow
                          key={subject.id}
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/semesters/${semester.id}/subjects/${subject.id}`)
                          }
                        >
                          <TableCell className="px-6 font-semibold text-gray-900">
                            {subject.subjectCode}
                          </TableCell>
                          <TableCell className="px-6 text-sm text-gray-600">
                            {subject.subjectName}
                          </TableCell>
                          <TableCell className="px-6 text-sm text-gray-600">
                            {subject.subjectTeachers.length > 0
                              ? subject.subjectTeachers
                                  .map((assignment) => assignment.teacher.name)
                                  .join(', ')
                              : 'No teachers assigned'}
                          </TableCell>
                          <TableCell className="px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  router.push(
                                    `/admin/semesters/${semester.id}/subjects/${subject.id}`,
                                  )
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No subjects available for this semester.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
