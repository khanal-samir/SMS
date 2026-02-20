'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { AnnouncementListTable } from '@/components/announcement/announcement-list-table'
import { CreateAnnouncementDialog } from '@/components/announcement/create-announcement-dialog'
import { useAnnouncements } from '@/hooks/useAnnouncement'
import { useAuthStore } from '@/store/auth.store'
import type { AnnouncementResponse } from '@repo/schemas'

export default function TeacherAnnouncementsPage() {
  const { data: announcements, isLoading } = useAnnouncements()
  const { user } = useAuthStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const isOwner = (announcement: AnnouncementResponse) => announcement.createdById === user?.id

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/teacher/dashboard', label: 'Dashboard' }}
          title="Announcements"
          description="Manage your announcements and view others"
          actions={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Announcement
            </Button>
          }
        />

        <AnnouncementListTable
          announcements={announcements}
          isLoading={isLoading}
          canEdit={isOwner}
          canDelete={isOwner}
          backHref="/teacher/dashboard"
        />

        <CreateAnnouncementDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      </div>
    </div>
  )
}
