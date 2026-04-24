import { ResourcesPage } from '@/components/resource/resources-page'

export default function StudentResourcesPage() {
  return (
    <ResourcesPage
      variant="student"
      backHref="/student/dashboard"
      title="Resources"
      description="View and download resources shared by your teachers"
    />
  )
}
