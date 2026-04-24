import { AssignmentsPage } from '@/components/assignment/assignments-page'

export default function AdminAssignmentsPage() {
  return (
    <AssignmentsPage
      variant="admin"
      backHref="/admin/dashboard"
      title="Assignment Management"
      description="View and manage all assignments across subjects and teachers"
    />
  )
}
