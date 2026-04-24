import { ParamStudentDetailPage } from '@/components/student/student-detail-page'

export default function AdminBatchStudentDetailPage() {
  return (
    <ParamStudentDetailPage
      studentIdParam="studentId"
      backButtonFromParam={{ prefix: '/admin/batches', param: 'id', label: 'Back to Batch' }}
      description="Student profile and academic progress"
      loadingMessage="Loading student details..."
      notFoundTitle="Student Not Found"
      notFoundMessage="The student you're looking for could not be found."
    />
  )
}
