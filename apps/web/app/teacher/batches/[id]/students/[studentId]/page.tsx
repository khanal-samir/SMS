'use client'

import { useParams } from 'next/navigation'
import { useStudentDetail } from '@/hooks/useUser'
import { StudentDetailView } from '@/components/student/student-detail-view'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'

export default function TeacherBatchStudentDetailPage() {
  const params = useParams()
  const batchId = params.id as string
  const studentId = params.studentId as string

  const { data: student, isLoading } = useStudentDetail(studentId)

  if (isLoading) {
    return <LoadingState message="Loading student details..." />
  }

  if (!student) {
    return (
      <NotFoundState
        title="Student Not Found"
        message="The student you're looking for could not be found."
        backButton={{ href: `/teacher/batches/${batchId}`, label: 'Back to Batch' }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: `/teacher/batches/${batchId}`, label: 'Back to Batch' }}
          title={student.name}
          description="Student profile and academic progress"
        />

        <StudentDetailView student={student} />
      </div>
    </div>
  )
}
