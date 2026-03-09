'use client'

import { AssignmentStatusEnum, type AssignmentResponse } from '@repo/schemas'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { BookOpen, GraduationCap, User, Calendar } from 'lucide-react'
import { formatShortDate } from '@/lib/formatters'

interface ViewAssignmentDialogProps {
  assignment: AssignmentResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

function StatusBadge({ assignment }: { assignment: AssignmentResponse }) {
  const isPastDue =
    assignment.status === AssignmentStatusEnum.enum.PAST_DUE ||
    (assignment.status === AssignmentStatusEnum.enum.PUBLISHED &&
      new Date(assignment.dueDate) < new Date())

  if (isPastDue) {
    return <Badge variant="destructive">Past Due</Badge>
  }
  return <Badge variant="info">Published</Badge>
}

export function ViewAssignmentDialog({
  assignment,
  open,
  onOpenChange,
}: ViewAssignmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-start gap-3 pr-6">
            <DialogTitle className="flex-1 text-xl leading-snug">{assignment.title}</DialogTitle>
            <StatusBadge assignment={assignment} />
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {assignment.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {assignment.description}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">No description provided.</p>
          )}

          <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start gap-3 text-sm">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-info-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="font-medium text-foreground">
                  {assignment.subjectTeacher.subject.subjectName}{' '}
                  <span className="font-normal text-muted-foreground">
                    ({assignment.subjectTeacher.subject.subjectCode})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-success-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Teacher</p>
                <p className="font-medium text-foreground">
                  {assignment.subjectTeacher.teacher.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Batch</p>
                <p className="font-medium text-foreground">Batch {assignment.batch.batchYear}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="font-medium text-foreground">{formatShortDate(assignment.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
