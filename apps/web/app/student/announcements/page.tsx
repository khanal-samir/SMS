'use client'

import { PageHeader } from '@/components/ui/page-header'
import { useAnnouncements } from '@/hooks/useAnnouncement'
import { StudentAnnouncementList } from '@/components/announcement/student-announcement-list'

export default function StudentAnnouncementsPage() {
  const { data: announcements, isLoading } = useAnnouncements()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/student/dashboard', label: 'Dashboard' }}
          title="Announcements"
          description="Stay up to date with the latest announcements"
        />

        <StudentAnnouncementList announcements={announcements} isLoading={isLoading} />
      </div>
    </div>
  )
}
