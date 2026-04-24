'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { ResourceListTable } from '@/components/resource/resource-list-table'
import { useResources } from '@/hooks/useResource'

const CreateResourceSheet = dynamic(
  () => import('@/components/resource/create-resource-sheet').then((module) => module.CreateResourceSheet),
  { ssr: false },
)

interface ResourcesPageProps {
  variant: 'student' | 'teacher' | 'admin'
  backHref: string
  title: string
  description: string
}

export function ResourcesPage({ variant, backHref, title, description }: ResourcesPageProps) {
  const { data: resources, isLoading } = useResources()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const isReadonly = variant === 'student'

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: backHref, label: 'Dashboard' }}
          title={title}
          description={description}
          actions={
            !isReadonly ? (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Resource
              </Button>
            ) : undefined
          }
        />

        <ResourceListTable
          resources={resources}
          isLoading={isLoading}
          readonly={isReadonly}
          showTeacher={variant === 'admin'}
          emptyBackHref={backHref}
        />

        {variant === 'teacher' ? (
          <CreateResourceSheet
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            variant="teacher"
          />
        ) : null}
        {variant === 'admin' ? (
          <CreateResourceSheet
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            variant="admin"
          />
        ) : null}
      </div>
    </div>
  )
}
