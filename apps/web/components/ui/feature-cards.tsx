import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureCardsProps {
  assignmentsHref: string
  resourcesHref: string
}

export function FeatureCards({ assignmentsHref, resourcesHref }: FeatureCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link href={assignmentsHref} className="block">
        <Card className="h-full cursor-pointer transition-colors hover:border-gray-300">
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>View and manage assignments for this subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Click to view assignments.</p>
          </CardContent>
        </Card>
      </Link>
      <Link href={resourcesHref} className="block">
        <Card className="h-full cursor-pointer transition-colors hover:border-gray-300">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Access learning resources for this subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Click to view resources.</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
