import { Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAvatar } from '@/components/ui/user-avatar'
import type { SubjectTeacherResponse } from '@repo/schemas'

interface AssignedTeachersCardProps {
  subjectTeachers: SubjectTeacherResponse[] | null | undefined
  isLoading: boolean
  onUnassign: (assignment: SubjectTeacherResponse) => void
  isUnassigning: boolean
}

function AssignedTeachersCard({
  subjectTeachers,
  isLoading,
  onUnassign,
  isUnassigning,
}: AssignedTeachersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Teachers</CardTitle>
        <CardDescription>Manage teachers assigned to this subject.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : subjectTeachers && subjectTeachers.length > 0 ? (
          <div className="space-y-3">
            {subjectTeachers.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar name={assignment.teacher.name} size="lg" />
                  <div>
                    <p className="font-semibold text-foreground">{assignment.teacher.name}</p>
                    <p className="text-sm text-muted-foreground">{assignment.teacher.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUnassigning}
                  onClick={() => onUnassign(assignment)}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  Unassign
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-2 rounded-full bg-muted p-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No teachers assigned</p>
            <p className="text-xs text-muted-foreground">
              Select a teacher from the right panel to assign
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { AssignedTeachersCard }
