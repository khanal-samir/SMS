import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ClipboardList, FolderOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureCardsProps {
  assignmentsHref: string
  resourcesHref: string
  assignmentsIcon?: LucideIcon
  resourcesIcon?: LucideIcon
}

export function FeatureCards({
  assignmentsHref,
  resourcesHref,
  assignmentsIcon: AssignmentsIcon = ClipboardList,
  resourcesIcon: ResourcesIcon = FolderOpen,
}: FeatureCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link href={assignmentsHref} className="block">
        <Card className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AssignmentsIcon className="size-5 text-muted-foreground" />
              <CardTitle>Assignments</CardTitle>
            </div>
            <CardDescription>View and manage assignments for this subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Click to view assignments.</p>
          </CardContent>
        </Card>
      </Link>
      <Link href={resourcesHref} className="block">
        <Card className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ResourcesIcon className="size-5 text-muted-foreground" />
              <CardTitle>Resources</CardTitle>
            </div>
            <CardDescription>Access learning resources for this subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Click to view resources.</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
