'use client'

import { useParams, useRouter } from 'next/navigation'
import { Code, Activity, ClipboardList, FolderOpen, ArrowRight } from 'lucide-react'
import { useSubject } from '@/hooks/useSubject'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { StatsStrip } from '@/components/dashboard/stats-strip'
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
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/student/courses', label: 'Courses' }}
          title={subject.subjectName}
          description={subject.subjectCode}
        />

        <StatsStrip
          stats={[
            {
              label: 'Subject Code',
              value: subject.subjectCode,
              icon: Code,
              iconColor: 'text-primary',
              iconBg: 'bg-primary/10',
            },
            {
              label: 'Status',
              value: 'Active',
              icon: Activity,
              iconColor: 'text-success-foreground',
              iconBg: 'bg-success/15',
            },
          ]}
        />

        <div className="card-elevated overflow-hidden">
          <Table className="table-clean">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Section</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {navItems.map((item) => (
                <TableRow
                  key={item.label}
                  className="cursor-pointer"
                  onClick={() => router.push(item.href)}
                >
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <item.icon className="size-4 text-muted-foreground" />
                      {item.label}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.description}</TableCell>
                  <TableCell className="text-right">
                    <ArrowRight className="inline size-4 text-muted-foreground" />
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
