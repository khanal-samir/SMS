'use client'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <DashboardPageHeader
          title="Student Dashboard"
          roleBadge={{
            text: 'Student',
            variant: 'info',
          }}
        />
      </div>
    </div>
  )
}
