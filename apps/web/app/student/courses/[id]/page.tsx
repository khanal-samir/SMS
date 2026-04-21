'use client'

import { useParams, useRouter } from 'next/navigation'
import { Code, Activity, ClipboardList, FolderOpen, ArrowRight } from 'lucide-react'
import { useSubject } from '@/hooks/useSubject'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { StatCards } from '@/components/ui/stat-cards'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function StudentCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.id as string

  const { data: subject, isLoading } = useSubject(subjectId)

  if (isLoading) {
    return <LoadingState />
  }

  if (!subject) {
    return (
      <NotFoundState
        title="Subject Not Found"
        message="The subject you're looking for could not be found."
        backButton={{ href: '/student/courses', label: 'Back to Courses' }}
      />
    )
  }

  const navItems = [
    {
      label: 'Assignments',
      description: 'View and manage assignments for this subject.',
      icon: ClipboardList,
      href: '/student/assignments',
    },
    {
      label: 'Resources',
      description: 'Access learning resources for this subject.',
      icon: FolderOpen,
      href: '/student/resources',
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/student/courses', label: 'Courses' }}
          title={subject.subjectName}
          description={subject.subjectCode}
        />

        <StatCards
          variant="strip"
          stats={[
            { label: 'Subject Code', value: subject.subjectCode, icon: Code },
            { label: 'Status', value: 'Active', icon: Activity },
          ]}
        />

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Section</TableHead>
                <TableHead className="px-4">Description</TableHead>
                <TableHead className="px-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {navItems.map((item) => (
                <TableRow
                  key={item.label}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => router.push(item.href)}
                >
                  <TableCell className="px-4 font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <item.icon className="size-4 text-muted-foreground" />
                      {item.label}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 text-muted-foreground">
                    {item.description}
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <ArrowRight className="inline size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
