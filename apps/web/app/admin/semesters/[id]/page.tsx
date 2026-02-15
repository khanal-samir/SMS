'use client'

import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSemester } from '@/hooks/useSemester'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!semester) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500">Semester not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/semesters')}>
          Back to Semesters
        </Button>
      </div>
    )
  }

  const semesterLabel = `${formatSemesterNumber(semester.semesterNumber)} Semester`

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/semesters', label: 'All Semesters' }}
          title={semesterLabel}
          description="Manage subjects and assignments for this semester"
        />

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Semester</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{semesterLabel}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{semester.subjects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Assigned Teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {semester.subjects.reduce(
                  (total: number, subject: SemesterDetailResponse['subjects'][number]) =>
                    total + subject.subjectTeachers.length,
                  0,
                )}
              </p>
            </CardContent>
          </Card>
        </div>

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
