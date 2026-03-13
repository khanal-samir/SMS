import { Calendar, GraduationCap, Users, Activity } from 'lucide-react'
import { StatCards } from '@/components/ui/stat-cards'
import { formatSemesterNumber } from '@/lib/formatters'
import type { BatchDetailResponse } from '@repo/schemas'

interface BatchInfoCardsProps {
  batch: BatchDetailResponse
}

function BatchInfoCards({ batch }: BatchInfoCardsProps) {
  return (
    <StatCards
      variant="strip"
      columns={4}
      stats={[
        { label: 'Batch Year', value: batch.batchYear, icon: Calendar },
        {
          label: 'Current Semester',
          value: batch.currentSemester
            ? `${formatSemesterNumber(batch.currentSemester.semesterNumber)} Semester`
            : 'No semester',
          icon: GraduationCap,
        },
        { label: 'Total Students', value: batch.totalStudents, icon: Users },
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
        },
      ]}
    />
  )
}

export { BatchInfoCards }
