'use client'

import { useParams } from 'next/navigation'
import { useStudentDetail } from '@/hooks/useUser'
import { StudentDetailView } from '@/components/student/student-detail-view'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'

export default function AdminStudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string

  const { data: student, isLoading } = useStudentDetail(studentId)

  if (isLoading) {
    return <LoadingState message="Loading student details..." />
  }

  if (!student) {
    return (
      <NotFoundState
        title="Student Not Found"
        message="The student you're looking for could not be found."
        backButton={{ href: '/admin/users', label: 'Back to Users' }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/users', label: 'All Users' }}
          title={student.name}
          description="Student profile and academic progress"
        />

        <StudentDetailView student={student} />
      </div>
    </div>
  )
}
