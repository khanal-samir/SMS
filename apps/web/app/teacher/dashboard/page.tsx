'use client'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <DashboardPageHeader
          title="Teacher Dashboard"
          roleBadge={{
            text: 'Teacher',
            variant: 'success',
          }}
        />

        <h1 className="mt-6 text-xl font-semibold">Work In Progress for Teacher</h1>
      </div>
    </div>
  )
}
