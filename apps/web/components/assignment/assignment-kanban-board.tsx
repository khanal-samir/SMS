'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from '@/components/reui/kanban'
import type { KanbanMoveEvent } from '@/components/reui/kanban'
import { AssignmentCard } from './assignment-card'
import { EditAssignmentDialog } from './edit-assignment-dialog'
import { ViewAssignmentDialog } from './view-assignment-dialog'
import { useUpdateAssignmentStatus } from '@/hooks/useAssignment'
import { toast } from 'sonner'
import { AssignmentStatusEnum, type AssignmentResponse, type AssignmentStatus } from '@repo/schemas'
import { groupAssignments } from '@/lib/formatters'

const COLUMN_CONFIG = {
  DRAFT: {
    label: 'Draft',
    color: 'text-gray-900',
    bgColor: 'bg-gradient-to-b from-gray-50 to-gray-100',
    borderColor: 'border-gray-400',
  },
  PUBLISHED: {
    label: 'Published',
    color: 'text-blue-900',
    bgColor: 'bg-gradient-to-b from-blue-50 to-blue-100',
    borderColor: 'border-blue-400',
  },
  PAST_DUE: {
    label: 'Past Due',
    color: 'text-red-900',
    bgColor: 'bg-gradient-to-b from-red-50 to-red-100',
    borderColor: 'border-red-400',
  },
} as const

type ColumnId = keyof typeof COLUMN_CONFIG

const COLUMN_ORDER: ColumnId[] = [
  AssignmentStatusEnum.enum.DRAFT,
  AssignmentStatusEnum.enum.PUBLISHED,
  AssignmentStatusEnum.enum.PAST_DUE,
]
const READONLY_COLUMN_ORDER: ColumnId[] = [
  AssignmentStatusEnum.enum.PUBLISHED,
  AssignmentStatusEnum.enum.PAST_DUE,
]

interface AssignmentKanbanBoardProps {
  assignments: AssignmentResponse[]
  onCreateClick?: () => void
  readonly?: boolean
}

export function AssignmentKanbanBoard({
  assignments,
  onCreateClick,
  readonly = false,
}: AssignmentKanbanBoardProps) {
  const [editingAssignment, setEditingAssignment] = useState<AssignmentResponse | null>(null)
  const updateStatusMutation = useUpdateAssignmentStatus()

  const groupedColumns = useMemo(() => groupAssignments(assignments), [assignments])
  const [columns, setColumns] = useState<Record<string, AssignmentResponse[]>>(groupedColumns)

  // Keep columns in sync when assignments data changes from server
  useEffect(() => {
    setColumns(groupedColumns)
  }, [groupedColumns])

  const handleMove = useCallback(
    (event: KanbanMoveEvent) => {
      if (readonly) return
      const { activeContainer, overContainer } = event

      if (activeContainer === overContainer) return

      // Find the assignment being moved
      const activeItems = columns[activeContainer]
      if (!activeItems) return

      const movedAssignment = activeItems[event.activeIndex]
      if (!movedAssignment) return

      // Optimistically update local state
      const newColumns = { ...columns }
      const newActiveItems = [...(newColumns[activeContainer] ?? [])]
      const newOverItems = [...(newColumns[overContainer] ?? [])]

      newActiveItems.splice(event.activeIndex, 1)
      newOverItems.splice(event.overIndex, 0, movedAssignment)

      newColumns[activeContainer] = newActiveItems
      newColumns[overContainer] = newOverItems
      setColumns(newColumns)

      // Call API to persist the status change
      updateStatusMutation.mutate(
        {
          id: movedAssignment.id,
          dto: { status: overContainer as AssignmentStatus },
        },
        {
          onError: () => {
            setColumns(groupedColumns)
            toast.error('Failed to update assignment status')
          },
        },
      )
    },
    [columns, groupedColumns, readonly, updateStatusMutation],
  )

  return (
    <>
      <Kanban
        value={columns}
        onValueChange={setColumns}
        getItemValue={(item: AssignmentResponse) => item.id}
        onMove={handleMove}
      >
        <KanbanBoard>
          {(readonly ? READONLY_COLUMN_ORDER : COLUMN_ORDER).map((columnId) => {
            const config = COLUMN_CONFIG[columnId]
            const items = columns[columnId] ?? []

            return (
              <KanbanColumn
                key={columnId}
                value={columnId}
                disabled
                className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-4 shadow-sm`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold ${config.color}`}>{config.label}</h3>
                    <Badge variant="secondary" className="h-6 px-2 text-sm font-semibold">
                      {items.length}
                    </Badge>
                  </div>
                  {columnId === AssignmentStatusEnum.enum.DRAFT && onCreateClick && (
                    <button
                      onClick={onCreateClick}
                      className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-white hover:text-gray-700 hover:shadow-sm"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <KanbanColumnContent value={columnId} className="min-h-[120px] space-y-3">
                  {items.map((assignment) =>
                    readonly ? (
                      <KanbanItem key={assignment.id} value={assignment.id} disabled>
                        <AssignmentCard
                          assignment={assignment}
                          onClick={() => setEditingAssignment(assignment)}
                        />
                      </KanbanItem>
                    ) : (
                      <KanbanItem key={assignment.id} value={assignment.id}>
                        <KanbanItemHandle>
                          <AssignmentCard
                            assignment={assignment}
                            onClick={() => setEditingAssignment(assignment)}
                          />
                        </KanbanItemHandle>
                      </KanbanItem>
                    ),
                  )}
                  {items.length === 0 && (
                    <div className="flex h-[100px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
                      <p className="text-sm text-gray-600 font-medium">
                        {columnId === AssignmentStatusEnum.enum.DRAFT
                          ? 'No draft assignments'
                          : columnId === AssignmentStatusEnum.enum.PUBLISHED
                            ? 'No published assignments'
                            : 'No past due assignments'}
                      </p>
                    </div>
                  )}
                </KanbanColumnContent>
              </KanbanColumn>
            )
          })}
        </KanbanBoard>

        {!readonly && (
          <KanbanOverlay>
            {({ value }) => {
              const allAssignments = Object.values(columns).flat()
              const assignment = allAssignments.find((a) => a.id === value)

              if (!assignment) return <div className="rounded-lg bg-gray-100 p-4 shadow-lg" />

              return (
                <div className="rotate-2 scale-105">
                  <AssignmentCard assignment={assignment} />
                </div>
              )
            }}
          </KanbanOverlay>
        )}
      </Kanban>

      {editingAssignment && !readonly && (
        <EditAssignmentDialog
          assignment={editingAssignment}
          open={!!editingAssignment}
          onOpenChange={(open: boolean) => {
            if (!open) setEditingAssignment(null)
          }}
        />
      )}

      {editingAssignment && readonly && (
        <ViewAssignmentDialog
          assignment={editingAssignment}
          open={!!editingAssignment}
          onOpenChange={(open: boolean) => {
            if (!open) setEditingAssignment(null)
          }}
        />
      )}
    </>
  )
}
