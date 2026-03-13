'use client'

import { Calendar, Construction } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

export default function TeacherSchedulePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Schedule"
          description="View and manage your teaching schedule"
          backButton={{ href: '/teacher/dashboard', label: 'Dashboard' }}
        />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="size-10" />
              <Construction className="size-10" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">Coming soon</h2>
            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
              The schedule feature is currently under development. You&apos;ll be able to view and
              manage your teaching schedule here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
