'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { ResourceListTable } from '@/components/resource/resource-list-table'
import { CreateResourceSheet } from '@/components/resource/create-resource-sheet'
import { useResources } from '@/hooks/useResource'

export default function AdminResourcesPage() {
  const { data: resources, isLoading } = useResources()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/dashboard', label: 'Dashboard' }}
          title="Resource Management"
          description="View and manage all resources across subjects and teachers"
          actions={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Resource
            </Button>
          }
        />

        <ResourceListTable
          resources={resources}
          isLoading={isLoading}
          showTeacher
          emptyBackHref="/admin/dashboard"
        />

        <CreateResourceSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} variant="admin" />
      </div>
    </div>
  )
}
