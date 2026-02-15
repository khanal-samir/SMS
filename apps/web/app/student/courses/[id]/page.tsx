'use client'

import { useParams } from 'next/navigation'
import { useSubject } from '@/hooks/useSubject'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StudentCourseDetailPage() {
  const params = useParams()
  const subjectId = params.id as string

  const { data: subject, isLoading } = useSubject(subjectId)

  if (isLoading) {
    return <LoadingState />
  }

  if (!subject) {
    return (
      <NotFoundState
        title="Subject Not Found"
        message="The subject you're looking for could not be found."
        backButton={{ href: '/student/courses', label: 'Back to Courses' }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/student/courses', label: 'Courses' }}
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
              <CardDescription>Status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* TODO: Replace placeholders with assignments/resources once backend is ready. */}
        <div className="grid gap-4 md:grid-cols-2">
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
