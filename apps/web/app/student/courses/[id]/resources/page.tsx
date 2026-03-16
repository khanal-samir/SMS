'use client'

import { useParams } from 'next/navigation'
import { useSubject } from '@/hooks/useSubject'
import { useResources } from '@/hooks/useResource'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { ResourceListTable } from '@/components/resource/resource-list-table'

export default function StudentCourseResourcesPage() {
  const params = useParams()
  const subjectId = params.id as string

  const { data: subject, isLoading: isSubjectLoading } = useSubject(subjectId)
  const { data: resources, isLoading: isResourcesLoading } = useResources(subjectId)

  if (isSubjectLoading) {
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: `/student/courses/${subjectId}`, label: subject.subjectName }}
          title={`${subject.subjectName} — Resources`}
          description={`Resources for ${subject.subjectCode}`}
        />

        <ResourceListTable
          resources={resources}
          isLoading={isResourcesLoading}
          readonly
          emptyBackHref={`/student/courses/${subjectId}`}
        />
      </div>
    </div>
  )
}
