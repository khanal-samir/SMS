'use client'

import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useSubject, useSubjectTeachers } from '@/hooks/useSubject'
import { Button } from '@/components/ui/button'
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
  const router = useRouter()
  const params = useParams()
  const subjectId = params.id as string

  const { data: subject, isLoading: isLoadingSubject } = useSubject(subjectId)
  const { data: teachers, isLoading: isLoadingTeachers } = useSubjectTeachers(subjectId)

  if (isLoadingSubject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500">Subject not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/teacher/subjects')}>
          Back to Subjects
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/teacher/subjects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Subjects
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{subject.subjectName}</h1>
            <p className="text-gray-600">{subject.subjectCode}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Subject Code</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{subject.subjectCode}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Semester ID</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-gray-900 break-all">{subject.semesterId}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Co-Teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{teachers?.length ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Teachers</CardTitle>
            <CardDescription>Other teachers working on this subject.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTeachers ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : teachers && teachers.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
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
                        <TableCell className="px-6 font-medium text-gray-900">
                          {assignment.teacher.name}
                        </TableCell>
                        <TableCell className="px-6 text-sm text-gray-600">
                          {assignment.teacher.email}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">No teachers assigned.</p>
            )}
          </CardContent>
        </Card>

        {/* TODO: Replace placeholders with assignments/resources once backend is ready. */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Assignments for this subject.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Coming soon.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Learning resources for this subject.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Coming soon.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
