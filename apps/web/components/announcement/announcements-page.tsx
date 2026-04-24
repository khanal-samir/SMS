'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { AnnouncementListTable } from '@/components/announcement/announcement-list-table'
import { StudentAnnouncementList } from '@/components/announcement/student-announcement-list'
import { useAnnouncements } from '@/hooks/useAnnouncement'
import { useAuthStore } from '@/store/auth.store'
import type { AnnouncementResponse } from '@repo/schemas'

const CreateAnnouncementDialog = dynamic(
  () =>
    import('@/components/announcement/create-announcement-dialog').then(
      (module) => module.CreateAnnouncementDialog,
    ),
  { ssr: false },
)

interface AnnouncementsPageProps {
  variant: 'student' | 'teacher' | 'admin'
  backHref: string
  title: string
  description: string
}

export function AnnouncementsPage({ variant, backHref, title, description }: AnnouncementsPageProps) {
  const { data: announcements, isLoading } = useAnnouncements()
  const { user } = useAuthStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const isOwner = (announcement: AnnouncementResponse) => announcement.createdById === user?.id

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: backHref, label: 'Dashboard' }}
          title={title}
          description={description}
          actions={
            variant !== 'student' ? (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Announcement
              </Button>
            ) : undefined
          }
        />

        {variant === 'student' ? (
          <StudentAnnouncementList announcements={announcements} isLoading={isLoading} />
        ) : null}

        {variant === 'teacher' ? (
          <AnnouncementListTable
            announcements={announcements}
            isLoading={isLoading}
            canEdit={isOwner}
            canDelete={isOwner}
            backHref={backHref}
          />
        ) : null}

        {variant === 'admin' ? (
          <AnnouncementListTable
            announcements={announcements}
            isLoading={isLoading}
            showReadCount
            canEdit={() => true}
            canDelete={() => true}
            backHref={backHref}
          />
        ) : null}

        {variant !== 'student' ? (
          <CreateAnnouncementDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        ) : null}
      </div>
    </div>
  )
}
