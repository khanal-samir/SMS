import { Calendar, GraduationCap, Users, Activity } from 'lucide-react'
import { StatsStrip } from '@/components/dashboard/stats-strip'
import { formatSemesterNumber } from '@/lib/formatters'
import type { BatchDetailResponse } from '@repo/schemas'

interface BatchInfoCardsProps {
  batch: BatchDetailResponse
}

function BatchInfoCards({ batch }: BatchInfoCardsProps) {
  return (
    <StatsStrip
      stats={[
        {
          label: 'Batch Year',
          value: batch.batchYear,
          icon: Calendar,
          iconColor: 'text-primary',
          iconBg: 'bg-primary/10',
        },
        {
          label: 'Current Semester',
          value: batch.currentSemester
            ? `${formatSemesterNumber(batch.currentSemester.semesterNumber)} Semester`
            : 'No semester',
          icon: GraduationCap,
          iconColor: 'text-info',
          iconBg: 'bg-info/10',
        },
        {
          label: 'Total Students',
          value: batch.totalStudents,
          icon: Users,
          iconColor: 'text-success-foreground',
          iconBg: 'bg-success/15',
        },
        {
          label: 'Status',
          value: (
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${
                batch.isActive
                  ? 'bg-success/15 text-success-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {batch.isActive ? 'Active' : 'Inactive'}
            </span>
          ),
          icon: Activity,
          iconColor: batch.isActive ? 'text-success-foreground' : 'text-muted-foreground',
          iconBg: batch.isActive ? 'bg-success/15' : 'bg-muted',
        },
      ]}
    />
  )
}

export { BatchInfoCards }
