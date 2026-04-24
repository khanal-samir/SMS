import { AnnouncementsPage } from '@/components/announcement/announcements-page'

export default function StudentAnnouncementsPage() {
  return (
    <AnnouncementsPage
      variant="student"
      backHref="/student/dashboard"
      title="Announcements"
      description="Stay up to date with the latest announcements"
    />
  )
}
