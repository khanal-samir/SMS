'use client'
import { Calendar, BookOpen, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { AssignmentResponse } from '@repo/schemas'
import { formatShortDate, getDueDateInfo } from '@/lib/formatters'

interface AssignmentCardProps {
  assignment: AssignmentResponse
  onClick?: () => void
}

export function AssignmentCard({ assignment, onClick }: AssignmentCardProps) {
  const dueDateInfo = getDueDateInfo(assignment.dueDate)

  return (
    <div
      className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white p-4 shadow-md transition-all hover:shadow-lg hover:border-gray-400"
      onClick={onClick}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="flex-1 text-base font-semibold text-gray-900 leading-tight">
          {assignment.title}
        </h4>
      </div>

      {assignment.description && (
        <p className="mb-3 line-clamp-2 text-sm text-gray-700">{assignment.description}</p>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <span className="truncate font-medium">
            {assignment.subjectTeacher.subject.subjectName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <GraduationCap className="h-4 w-4 text-green-600" />
          <span className="font-medium">Batch {assignment.batch.batchYear}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className={`flex items-center gap-2 text-sm font-medium ${dueDateInfo.color}`}>
            <Calendar className="h-4 w-4" />
            <span>{formatShortDate(assignment.dueDate)}</span>
          </div>
          {dueDateInfo.urgent && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 border-orange-300 bg-orange-50 text-orange-700 font-semibold"
            >
              {dueDateInfo.label}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
