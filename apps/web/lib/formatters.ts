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
      className: 'bg-muted text-muted-foreground',
    }
  }
  if (isPastDue || assignment.status === AssignmentStatusEnum.enum.PAST_DUE) {
    return {
      label: 'Past Due',
      className: 'bg-destructive/10 text-destructive',
    }
  }
  return {
    label: 'Published',
    className: 'bg-success/15 text-success-foreground',
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
    return { label: `${Math.abs(diffDays)}d overdue`, urgent: true, color: 'text-destructive' }
  }
  if (diffDays === 0) {
    return { label: 'Due today', urgent: true, color: 'text-warning-foreground' }
  }
  if (diffDays <= 3) {
    return { label: `${diffDays}d left`, urgent: true, color: 'text-warning-foreground' }
  }
  return { label: `${diffDays}d left`, urgent: false, color: 'text-muted-foreground' }
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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}
