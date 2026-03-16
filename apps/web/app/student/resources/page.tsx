'use client'

import { PageHeader } from '@/components/ui/page-header'
import { ResourceListTable } from '@/components/resource/resource-list-table'
import { useResources } from '@/hooks/useResource'

export default function StudentResourcesPage() {
  const { data: resources, isLoading } = useResources()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/student/dashboard', label: 'Dashboard' }}
          title="Resources"
          description="View and download resources shared by your teachers"
        />

        <ResourceListTable
          resources={resources}
          isLoading={isLoading}
          readonly
          emptyBackHref="/student/dashboard"
        />
      </div>
    </div>
  )
}
