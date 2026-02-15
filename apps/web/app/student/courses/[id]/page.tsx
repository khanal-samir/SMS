'use client'

import { useParams } from 'next/navigation'
import { useSubject } from '@/hooks/useSubject'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { StatCards } from '@/components/ui/stat-cards'
import { FeatureCards } from '@/components/ui/feature-cards'

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

        <StatCards
          stats={[
            { label: 'Subject Code', value: subject.subjectCode },
            { label: 'Status', value: 'Active' },
          ]}
        />

        <FeatureCards
          assignmentsHref={`/student/courses/${subject.id}/assignments`}
          resourcesHref={`/student/courses/${subject.id}/resources`}
        />
      </div>
    </div>
  )
}
