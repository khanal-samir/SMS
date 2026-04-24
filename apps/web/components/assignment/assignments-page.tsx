'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { AssignmentKanbanBoard } from '@/components/assignment/assignment-kanban-board'
import { AssignmentListTable } from '@/components/assignment/assignment-list-table'
import { useAssignments } from '@/hooks/useAssignment'

const CreateAssignmentDialog = dynamic(
  () =>
    import('@/components/assignment/create-assignment-dialog').then(
      (module) => module.CreateAssignmentDialog,
    ),
  { ssr: false },
)

const AdminCreateAssignmentDialog = dynamic(
  () =>
    import('@/components/assignment/admin-create-assignment-dialog').then(
      (module) => module.AdminCreateAssignmentDialog,
    ),
  { ssr: false },
)

interface AssignmentsPageProps {
  variant: 'student' | 'teacher' | 'admin'
  backHref: string
  title: string
  description: string
}

export function AssignmentsPage({ variant, backHref, title, description }: AssignmentsPageProps) {
  const { data: assignments, isLoading } = useAssignments()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  if (isLoading) {
    return <LoadingState message="Loading assignments..." />
  }

  if (variant === 'student' && (!assignments || assignments.length === 0)) {
    return (
      <NotFoundState
        title="No Assignments Found"
        message="You currently have no assignments. Please check back later or contact your teacher for more information."
        backButton={{ href: backHref, label: 'Back to Dashboard' }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className={variant === 'teacher' ? 'mx-auto max-w-7xl' : 'mx-auto max-w-6xl'}>
        <PageHeader
          backButton={{ href: backHref, label: 'Dashboard' }}
          title={title}
          description={description}
          actions={
            variant !== 'student' ? (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            ) : undefined
          }
        />

        {variant === 'student' ? (
          <AssignmentKanbanBoard assignments={assignments ?? []} readonly />
        ) : null}

        {variant === 'teacher' ? (
          <div className="rounded-xl bg-muted/50 p-6">
            <AssignmentKanbanBoard
              assignments={assignments ?? []}
              onCreateClick={() => setIsCreateDialogOpen(true)}
            />
          </div>
        ) : null}

        {variant === 'admin' ? (
          <AssignmentListTable assignments={assignments} isLoading={false} />
        ) : null}

        {variant === 'teacher' ? (
          <CreateAssignmentDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        ) : null}

        {variant === 'admin' ? (
          <AdminCreateAssignmentDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        ) : null}
      </div>
    </div>
  )
}
