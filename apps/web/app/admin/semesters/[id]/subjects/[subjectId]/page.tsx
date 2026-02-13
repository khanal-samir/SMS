'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import {
  useSubject,
  useSubjectTeachers,
  useAssignTeacher,
  useUnassignTeacher,
} from '@/hooks/useSubject'
import { useApprovedTeachers } from '@/hooks/useTeacher'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SubjectTeacherResponse, User } from '@repo/schemas'

export default function AdminSubjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const semesterId = params.id as string
  const subjectId = params.subjectId as string

  const { data: subject, isLoading: isLoadingSubject } = useSubject(subjectId)
  const { data: subjectTeachers, isLoading: isLoadingSubjectTeachers } =
    useSubjectTeachers(subjectId)
  const { data: approvedTeachers, isLoading: isLoadingApproved } = useApprovedTeachers()

  const { mutate: assignTeacher, isPending: isAssigning } = useAssignTeacher(subjectId)
  const { mutate: unassignTeacher, isPending: isUnassigning } = useUnassignTeacher(subjectId)
  const [teacherSearch, setTeacherSearch] = useState('')

  const assignedTeacherIds = useMemo(() => {
    if (!subjectTeachers) return new Set<string>()
    return new Set(subjectTeachers.map((assignment) => assignment.teacherId))
  }, [subjectTeachers])

  const availableTeachers = useMemo(() => {
    if (!approvedTeachers) return []
    return approvedTeachers.filter((teacher) => !assignedTeacherIds.has(teacher.id))
  }, [approvedTeachers, assignedTeacherIds])

  const filteredTeachers = useMemo(() => {
    const query = teacherSearch.trim().toLowerCase()
    if (!query) return availableTeachers
    return availableTeachers.filter((teacher) =>
      [teacher.name, teacher.email].some((value) => value.toLowerCase().includes(query)),
    )
  }, [availableTeachers, teacherSearch])

  const handleAssignTeacher = (teacher: User) => {
    assignTeacher({ teacherId: teacher.id, subjectId }, { onSuccess: () => setTeacherSearch('') })
  }

  const handleUnassignTeacher = (assignment: SubjectTeacherResponse) => {
    unassignTeacher({ teacherId: assignment.teacherId, subjectId })
  }

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
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push(`/admin/semesters/${semesterId}`)}
        >
          Back to Semester
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/semesters/${semesterId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Semester Subjects
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
              <CardDescription>Assigned Teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{subjectTeachers?.length ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Teachers</CardTitle>
              <CardDescription>Manage teachers assigned to this subject.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSubjectTeachers ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : subjectTeachers && subjectTeachers.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-6">Teacher</TableHead>
                        <TableHead className="px-6">Email</TableHead>
                        <TableHead className="px-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectTeachers.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="px-6 font-medium text-gray-900">
                            {assignment.teacher.name}
                          </TableCell>
                          <TableCell className="px-6 text-sm text-gray-600">
                            {assignment.teacher.email}
                          </TableCell>
                          <TableCell className="px-6 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUnassigning}
                              onClick={() => handleUnassignTeacher(assignment)}
                            >
                              Unassign
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-gray-500">No teachers assigned yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assign Teachers</CardTitle>
              <CardDescription>Select an approved teacher to assign.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search teachers by name or email"
                value={teacherSearch}
                onChange={(event) => setTeacherSearch(event.target.value)}
              />
              <div className="mt-4 max-h-64 space-y-2 overflow-auto">
                {isLoadingApproved ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-gray-50"
                      onClick={() => handleAssignTeacher(teacher)}
                      disabled={isAssigning}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{teacher.name}</p>
                        <p className="text-xs text-gray-500">{teacher.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">Assign</span>
                    </button>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-gray-500">
                    No available teachers found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

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
