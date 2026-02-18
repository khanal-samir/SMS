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
  return (
    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Published</Badge>
  )
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
            <p className="text-sm leading-relaxed text-gray-600">{assignment.description}</p>
          ) : (
            <p className="text-sm italic text-gray-400">No description provided.</p>
          )}

          <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-start gap-3 text-sm">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Subject</p>
                <p className="font-medium text-gray-900">
                  {assignment.subjectTeacher.subject.subjectName}{' '}
                  <span className="font-normal text-gray-500">
                    ({assignment.subjectTeacher.subject.subjectCode})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Teacher</p>
                <p className="font-medium text-gray-900">
                  {assignment.subjectTeacher.teacher.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500">Batch</p>
                <p className="font-medium text-gray-900">Batch {assignment.batch.batchYear}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p className="font-medium text-gray-900">{formatShortDate(assignment.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
