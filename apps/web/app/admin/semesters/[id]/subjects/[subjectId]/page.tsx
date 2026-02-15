'use client'

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import {
  useSubject,
  useSubjectTeachers,
  useAssignTeacher,
  useUnassignTeacher,
} from '@/hooks/useSubject'
import { useApprovedTeachers } from '@/hooks/useTeacher'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AssignedTeachersCard } from '@/components/subject/assigned-teachers-card'
import { AssignTeacherCard } from '@/components/subject/assign-teacher-card'
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

  const assignedTeacherIds = useMemo(() => {
    if (!subjectTeachers) return new Set<string>()
    return new Set(subjectTeachers.map((assignment) => assignment.teacherId))
  }, [subjectTeachers])

  const availableTeachers = useMemo(() => {
    if (!approvedTeachers) return []
    return approvedTeachers.filter((teacher) => !assignedTeacherIds.has(teacher.id))
  }, [approvedTeachers, assignedTeacherIds])

  const handleAssignTeacher = (teacher: User) => {
    assignTeacher({ teacherId: teacher.id, subjectId })
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
        <PageHeader
          backButton={{ href: `/admin/semesters/${semesterId}`, label: 'Semester Subjects' }}
          title={subject.subjectName}
          description={subject.subjectCode}
        />

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
          <AssignedTeachersCard
            subjectTeachers={subjectTeachers}
            isLoading={isLoadingSubjectTeachers}
            onUnassign={handleUnassignTeacher}
            isUnassigning={isUnassigning}
          />

          <AssignTeacherCard
            availableTeachers={availableTeachers}
            isLoading={isLoadingApproved}
            onAssign={handleAssignTeacher}
            isAssigning={isAssigning}
          />
        </div>

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
