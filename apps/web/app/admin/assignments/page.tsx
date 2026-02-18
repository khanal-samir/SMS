'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { AssignmentListTable } from '@/components/assignment/assignment-list-table'
import { AdminCreateAssignmentDialog } from '@/components/assignment/admin-create-assignment-dialog'
import { useAssignments } from '@/hooks/useAssignment'

export default function AdminAssignmentsPage() {
  const { data: assignments, isLoading } = useAssignments()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/dashboard', label: 'Dashboard' }}
          title="Assignment Management"
          description="View and manage all assignments across subjects and teachers"
          actions={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          }
        />

        <AssignmentListTable assignments={assignments} isLoading={isLoading} />

        <AdminCreateAssignmentDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </div>
  )
}
