'use client'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <DashboardPageHeader
          title="Student Dashboard"
          roleBadge={{
            text: 'Student',
            className: 'bg-blue-100 text-blue-800',
          }}
        />
      </div>
    </div>
  )
}
