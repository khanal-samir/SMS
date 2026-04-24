import { ResourcesPage } from '@/components/resource/resources-page'

export default function AdminResourcesPage() {
  return (
    <ResourcesPage
      variant="admin"
      backHref="/admin/dashboard"
      title="Resource Management"
      description="View and manage all resources across subjects and teachers"
    />
  )
}
