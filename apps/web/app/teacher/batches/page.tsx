'use client'

import { useBatches } from '@/hooks/useBatch'
import { BatchListTable } from '@/components/batch/batch-list-table'
import { PageHeader } from '@/components/ui/page-header'

export default function TeacherBatchesPage() {
  const { data: batches, isLoading } = useBatches()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/teacher/dashboard', label: 'Dashboard' }}
          title="Batches"
          description="View student batches and enrolled students"
        />

        <BatchListTable
          batches={batches}
          isLoading={isLoading}
          basePath="/teacher/batches"
          actionLabel="View Students"
          emptyMessage="No batches available."
        />
      </div>
    </div>
  )
}
