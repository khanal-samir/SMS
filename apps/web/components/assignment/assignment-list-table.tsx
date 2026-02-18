'use client'

import { useState } from 'react'
import { Loader2, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatShortDate, getStatusDisplay } from '@/lib/formatters'
import { useDeleteAssignment } from '@/hooks/useAssignment'
import { EditAssignmentDialog } from './edit-assignment-dialog'
import type { AssignmentResponse } from '@repo/schemas'
import { LoadingState } from '../ui/loading-state'
import { NotFoundState } from '../ui/not-found-state'

interface AssignmentListTableProps {
  assignments: AssignmentResponse[] | null | undefined
  isLoading: boolean
}

function AssignmentListTable({ assignments, isLoading }: AssignmentListTableProps) {
  const [editingAssignment, setEditingAssignment] = useState<AssignmentResponse | null>(null)
  const { mutate: deleteAssignment, isPending: isDeleting } = useDeleteAssignment()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingId(id)
    deleteAssignment(id, {
      onSettled: () => setDeletingId(null),
    })
  }

  if (isLoading) {
    return <LoadingState message="Loading Assignments" />
  }

  if (!assignments || assignments.length === 0) {
    return (
      <NotFoundState
        title="Assignments Not Found"
        message="The assignments you're looking for could not be found."
        backButton={{ href: '/admin/dashboard', label: 'Back to Dashboard' }}
      />
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => {
              const status = getStatusDisplay(assignment)
              return (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <span className="text-sm font-semibold text-gray-900">{assignment.title}</span>
                    {assignment.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                        {assignment.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {assignment.subjectTeacher.subject.subjectName}
                    <span className="ml-1 text-xs text-gray-400">
                      ({assignment.subjectTeacher.subject.subjectCode})
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {assignment.subjectTeacher.teacher.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    Batch {assignment.batch.batchYear}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatShortDate(assignment.dueDate)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAssignment(assignment)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(assignment.id)}
                        disabled={isDeleting && deletingId === assignment.id}
                      >
                        {isDeleting && deletingId === assignment.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {editingAssignment && (
        <EditAssignmentDialog
          assignment={editingAssignment}
          open={!!editingAssignment}
          onOpenChange={(open) => {
            if (!open) setEditingAssignment(null)
          }}
        />
      )}
    </>
  )
}

export { AssignmentListTable }
