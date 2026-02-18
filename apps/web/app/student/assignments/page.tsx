'use client'
import { PageHeader } from '@/components/ui/page-header'
import { useAssignments } from '@/hooks/useAssignment'
import { AssignmentKanbanBoard } from '@/components/assignment/assignment-kanban-board'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'

export default function StudentAssignmentsPage() {
  const { data: assignments, isLoading } = useAssignments()
  if (isLoading) {
    return <LoadingState message="Loading Assignments" />
  }

  if (!assignments || assignments.length === 0) {
    return (
      <NotFoundState
        title="No Assignments Found"
        message="You currently have no assignments. Please check back later or contact your teacher for more information."
        backButton={{ href: '/student/dashboard', label: 'Back to Dashboard' }}
      />
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/student/dashboard', label: 'Dashboard' }}
          title="Assignments"
          description="View your current and past assignments"
        />

        <AssignmentKanbanBoard assignments={assignments} readonly />
      </div>
    </div>
  )
}
