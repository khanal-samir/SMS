import { Calendar, GraduationCap, Users, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { formatSemesterNumber } from '@/lib/formatters'
import type { BatchDetailResponse } from '@repo/schemas'

interface BatchInfoCardsProps {
  batch: BatchDetailResponse
}

function BatchInfoCards({ batch }: BatchInfoCardsProps) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>Batch Year</CardDescription>
          <Calendar className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">{batch.batchYear}</p>
        </CardContent>
      </Card>
      <Card className="bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>Current Semester</CardDescription>
          <GraduationCap className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {batch.currentSemester
              ? `${formatSemesterNumber(batch.currentSemester.semesterNumber)} Semester`
              : 'No semester'}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>Total Students</CardDescription>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">{batch.totalStudents}</p>
        </CardContent>
      </Card>
      <Card className="bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription>Status</CardDescription>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${
              batch.isActive
                ? 'bg-success/15 text-success-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {batch.isActive ? 'Active' : 'Inactive'}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}

export { BatchInfoCards }
