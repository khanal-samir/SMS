import { AssignmentsPage } from '@/components/assignment/assignments-page'

export default function StudentAssignmentsPage() {
  return (
    <AssignmentsPage
      variant="student"
      backHref="/student/dashboard"
      title="Assignments"
      description="View your current and past assignments"
    />
  )
}
