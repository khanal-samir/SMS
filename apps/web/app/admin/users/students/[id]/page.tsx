import { ParamStudentDetailPage } from '@/components/student/student-detail-page'

export default function AdminStudentDetailPage() {
  return (
    <ParamStudentDetailPage
      studentIdParam="id"
      backButton={{ href: '/admin/users', label: 'All Users' }}
      description="Student profile and academic progress"
      loadingMessage="Loading student details..."
      notFoundTitle="Student Not Found"
      notFoundMessage="The student you're looking for could not be found."
    />
  )
}
