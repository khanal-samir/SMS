import { AssignmentsPage } from '@/components/assignment/assignments-page'

export default function TeacherAssignmentsPage() {
  return (
    <AssignmentsPage
      variant="teacher"
      backHref="/teacher/dashboard"
      title="Assignments"
      description="Manage assignments across all your subjects"
    />
  )
}
