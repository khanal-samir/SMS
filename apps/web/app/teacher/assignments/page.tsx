'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { AssignmentKanbanBoard } from '@/components/assignment/assignment-kanban-board'
import { CreateAssignmentDialog } from '@/components/assignment/create-assignment-dialog'
import { useAssignments } from '@/hooks/useAssignment'

export default function TeacherAssignmentsPage() {
  const { data: assignments, isLoading } = useAssignments()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  if (isLoading) {
    return <LoadingState message="Assignment Loading" />
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          backButton={{ href: '/teacher/dashboard', label: 'Dashboard' }}
          title="Assignments"
          description="Manage assignments across all your subjects"
          actions={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          }
        />

        <div className="rounded-xl bg-gray-50 p-6">
          <AssignmentKanbanBoard
            assignments={assignments ?? []}
            onCreateClick={() => setIsCreateDialogOpen(true)}
          />
        </div>

        <CreateAssignmentDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      </div>
    </div>
  )
}
