'use client'

import { useMyStudentDetail } from '@/hooks/useUser'
import { StudentDetailView } from '@/components/student/student-detail-view'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'

export default function StudentMyDetailsPage() {
  const { data: student, isLoading } = useMyStudentDetail()

  if (isLoading) {
    return <LoadingState message="Loading your details..." />
  }

  if (!student) {
    return (
      <NotFoundState
        title="Details Not Found"
        message="Could not load your student details."
        backButton={{ href: '/student/dashboard', label: 'Back to Dashboard' }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader title="My Details" description="Your profile and academic progress" />

        <StudentDetailView student={student} />
      </div>
    </div>
  )
}
