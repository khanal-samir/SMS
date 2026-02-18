import { AssignmentResponse, AssignmentStatusEnum } from '@repo/schemas'

export const formatShortDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const semesterLabelMap: Record<string, string> = {
  FIRST: '1st',
  SECOND: '2nd',
  THIRD: '3rd',
  FOURTH: '4th',
  FIFTH: '5th',
  SIXTH: '6th',
  SEVENTH: '7th',
  EIGHTH: '8th',
}

export const formatSemesterNumber = (semesterNumber: string) =>
  semesterLabelMap[semesterNumber] ?? semesterNumber

export function getStatusDisplay(assignment: AssignmentResponse) {
  const isPastDue =
    assignment.status === AssignmentStatusEnum.enum.PUBLISHED &&
    new Date(assignment.dueDate) < new Date()

  if (assignment.status === AssignmentStatusEnum.enum.DRAFT) {
    return {
      label: 'Draft',
      className: 'bg-gray-100 text-gray-800',
    }
  }
  if (isPastDue || assignment.status === AssignmentStatusEnum.enum.PAST_DUE) {
    return {
      label: 'Past Due',
      className: 'bg-red-100 text-red-800',
    }
  }
  return {
    label: 'Published',
    className: 'bg-green-100 text-green-800',
  }
}
export function formatDateForInput(dateStr: string) {
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0] ?? ''
}
export function getDueDateInfo(dueDate: string) {
  const due = new Date(dueDate)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { label: `${Math.abs(diffDays)}d overdue`, urgent: true, color: 'text-red-600' }
  }
  if (diffDays === 0) {
    return { label: 'Due today', urgent: true, color: 'text-orange-600' }
  }
  if (diffDays <= 3) {
    return { label: `${diffDays}d left`, urgent: true, color: 'text-orange-500' }
  }
  return { label: `${diffDays}d left`, urgent: false, color: 'text-gray-500' }
}
export function groupAssignments(assignments: AssignmentResponse[]) {
  const now = new Date()
  const result: Record<string, AssignmentResponse[]> = {
    DRAFT: [],
    PUBLISHED: [],
    PAST_DUE: [],
  }

  for (const assignment of assignments) {
    const isPastDue = assignment.status === 'PUBLISHED' && new Date(assignment.dueDate) < now

    if (isPastDue || assignment.status === 'PAST_DUE') {
      result['PAST_DUE']!.push(assignment)
    } else if (assignment.status === 'DRAFT') {
      result['DRAFT']!.push(assignment)
    } else if (assignment.status === 'PUBLISHED') {
      result['PUBLISHED']!.push(assignment)
    }
  }

  return result
}
