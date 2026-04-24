import { SelfStudentDetailPage } from '@/components/student/student-detail-page'

export default function StudentMyDetailsPage() {
  return (
    <SelfStudentDetailPage
      title="My Details"
      description="Your profile and academic progress"
      loadingMessage="Loading your details..."
      notFoundTitle="Details Not Found"
      notFoundMessage="Could not load your student details."
      backButton={{ href: '/student/dashboard', label: 'Back to Dashboard' }}
    />
  )
}
