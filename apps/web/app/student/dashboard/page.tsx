'use client'

import Link from 'next/link'
import {
  BookOpen,
  ClipboardList,
  Megaphone,
  Clock,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  Bell,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { StatCards } from '@/components/ui/stat-cards'
import { LoadingState } from '@/components/ui/loading-state'
import { useStudentDashboard } from '@/hooks/useDashboard'
import { formatShortDate, formatSemesterNumber, getDueDateInfo } from '@/lib/formatters'

export default function StudentDashboard() {
  const { data, isLoading } = useStudentDashboard()

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <DashboardPageHeader
          title="Student Dashboard"
          roleBadge={{ text: 'Student', variant: 'info' }}
        />

        {/* Stat cards row */}
        <StatCards
          columns={4}
          stats={[
            {
              label: 'Current semester',
              value: data?.currentSemester
                ? `${formatSemesterNumber(data.currentSemester)} Semester`
                : 'Not enrolled',
              icon: GraduationCap,
              size: 'small',
            },
            {
              label: 'Subjects',
              value: data?.stats.totalSubjects ?? 0,
              icon: BookOpen,
            },
            {
              label: 'Pending assignments',
              value: data?.stats.pendingAssignments ?? 0,
              icon: ClipboardList,
            },
            {
              label: 'Unread announcements',
              value: data?.stats.unreadAnnouncements ?? 0,
              icon: Bell,
            },
          ]}
        />

        {/* Bento grid: 2-column layout */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Upcoming assignments — takes 3 cols */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  Upcoming assignments
                </CardTitle>
                <CardDescription>Assignments due soon</CardDescription>
              </div>
              <Link
                href="/student/assignments"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {data?.upcomingAssignments && data.upcomingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {data.upcomingAssignments.map((assignment) => {
                    const dueDateInfo = getDueDateInfo(assignment.dueDate)
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.subjectTeacher.subject.subjectName}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {formatShortDate(assignment.dueDate)}
                          </span>
                          <span className={`text-xs font-medium ${dueDateInfo.color}`}>
                            {dueDateInfo.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No upcoming assignments
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent announcements — takes 2 cols */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="size-4 text-muted-foreground" />
                  Recent announcements
                </CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </div>
              <Link
                href="/student/announcements"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {data?.recentAnnouncements && data.recentAnnouncements.length > 0 ? (
                <div className="space-y-3">
                  {data.recentAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="flex items-start gap-3 rounded-lg border bg-card p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-foreground">
                            {announcement.title}
                          </p>
                          {!announcement.isRead && (
                            <Badge variant="info" className="text-[10px] px-1.5 py-0">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {announcement.message}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                          {formatShortDate(announcement.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No announcements yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'My courses',
              href: '/student/courses',
              icon: BookOpen,
              description: 'View enrolled subjects',
            },
            {
              label: 'Assignments',
              href: '/student/assignments',
              icon: ClipboardList,
              description: 'Track your assignments',
            },
            {
              label: 'Announcements',
              href: '/student/announcements',
              icon: Megaphone,
              description: 'Read latest updates',
            },
            {
              label: 'Chat',
              href: '/student/chat',
              icon: MessageSquare,
              description: 'Message your batch',
            },
          ].map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex items-center gap-3 pt-6">
                  <link.icon className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{link.label}</p>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
