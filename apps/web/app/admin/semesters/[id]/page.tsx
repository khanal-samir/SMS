'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, UserPlus } from 'lucide-react'
import { useSemester } from '@/hooks/useSemester'
import { useAssignTeacher, useUnassignTeacher } from '@/hooks/useSubject'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatSemesterNumber } from '@/lib/formatters'
import type { SemesterDetailResponse, User } from '@repo/schemas'

export default function AdminSemesterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const semesterId = params.id as string

  const { data: semester, isLoading } = useSemester(semesterId)
  const { data: approvedTeachers, isLoading: isLoadingTeachers } = useApprovedTeachers()
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null)
  const [teacherSearch, setTeacherSearch] = useState('')

  const { mutate: assignTeacher, isPending: isAssigning } = useAssignTeacher(activeSubjectId ?? '')
  const { mutate: unassignTeacher, isPending: isUnassigning } = useUnassignTeacher(
    activeSubjectId ?? '',
  )

  const activeSubject = useMemo(() => {
    if (!semester || !activeSubjectId) return null
    return semester.subjects.find(
      (subject: SemesterDetailResponse['subjects'][number]) => subject.id === activeSubjectId,
    )
  }, [semester, activeSubjectId])

  const availableTeachers = useMemo(() => {
    if (!approvedTeachers || !activeSubject) return []
    const assignedTeacherIds = new Set(
      activeSubject.subjectTeachers.map((assignment) => assignment.teacherId),
    )
    return approvedTeachers.filter((teacher) => !assignedTeacherIds.has(teacher.id))
  }, [approvedTeachers, activeSubject])

  const filteredTeachers = useMemo(() => {
    const query = teacherSearch.trim().toLowerCase()
    if (!query) return availableTeachers
    return availableTeachers.filter((teacher) =>
      [teacher.name, teacher.email].some((value) => value.toLowerCase().includes(query)),
    )
  }, [availableTeachers, teacherSearch])

  const handleAssignTeacher = (teacher: User) => {
    if (!activeSubject) return
    assignTeacher(
      { teacherId: teacher.id, subjectId: activeSubject.id },
      { onSuccess: () => setTeacherSearch('') },
    )
  }

  const handleUnassignTeacher = (teacherId: string) => {
    if (!activeSubject) return
    unassignTeacher({ teacherId, subjectId: activeSubject.id })
  }

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
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/semesters')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Semesters
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{semesterLabel}</h1>
            <p className="text-gray-600">Manage subjects and assignments for this semester</p>
          </div>
        </div>

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
                              <Dialog
                                open={activeSubjectId === subject.id}
                                onOpenChange={(open) => {
                                  setActiveSubjectId(open ? subject.id : null)
                                  if (!open) {
                                    setTeacherSearch('')
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Assign Teacher
                                  </Button>
                                </DialogTrigger>
                                <DialogContent onClick={(event) => event.stopPropagation()}>
                                  <DialogHeader>
                                    <DialogTitle>Assign Teachers</DialogTitle>
                                    <DialogDescription>
                                      Manage teachers for {subject.subjectName}.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">Assigned</p>
                                      {subject.subjectTeachers.length > 0 ? (
                                        <div className="mt-2 space-y-2">
                                          {subject.subjectTeachers.map((assignment) => (
                                            <div
                                              key={assignment.id}
                                              className="flex items-center justify-between rounded-md border px-3 py-2"
                                            >
                                              <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                  {assignment.teacher.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  {assignment.teacher.email}
                                                </p>
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={isUnassigning}
                                                onClick={() =>
                                                  handleUnassignTeacher(assignment.teacherId)
                                                }
                                              >
                                                Unassign
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="mt-2 text-sm text-gray-500">
                                          No teachers assigned yet.
                                        </p>
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium text-gray-700">
                                        Assign new
                                      </p>
                                      <Input
                                        className="mt-2"
                                        placeholder="Search teachers by name or email"
                                        value={teacherSearch}
                                        onChange={(event) => setTeacherSearch(event.target.value)}
                                      />
                                      <div className="mt-3 max-h-56 space-y-2 overflow-auto">
                                        {isLoadingTeachers ? (
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
                                                <p className="font-medium text-gray-900">
                                                  {teacher.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  {teacher.email}
                                                </p>
                                              </div>
                                              <span className="text-xs text-gray-400">Assign</span>
                                            </button>
                                          ))
                                        ) : (
                                          <p className="py-4 text-center text-sm text-gray-500">
                                            No available teachers found.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
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
