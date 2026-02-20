'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { AnnouncementListTable } from '@/components/announcement/announcement-list-table'
import { CreateAnnouncementDialog } from '@/components/announcement/create-announcement-dialog'
import { useAnnouncements } from '@/hooks/useAnnouncement'

export default function AdminAnnouncementsPage() {
  const { data: announcements, isLoading } = useAnnouncements()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/dashboard', label: 'Dashboard' }}
          title="Announcement Management"
          description="View and manage all announcements across the system"
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
          showReadCount
          canEdit={() => true}
          canDelete={() => true}
          backHref="/admin/dashboard"
        />

        <CreateAnnouncementDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      </div>
    </div>
  )
}
