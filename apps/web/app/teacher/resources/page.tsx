'use client'

import { FolderOpen, Construction } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

export default function TeacherResourcesPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Resources"
          description="Access and share teaching resources"
          backButton={{ href: '/teacher/dashboard', label: 'Dashboard' }}
        />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center gap-3 text-muted-foreground">
              <FolderOpen className="size-10" />
              <Construction className="size-10" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">Coming soon</h2>
            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
              The resources feature is currently under development. You&apos;ll be able to upload
              and share teaching materials here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
