'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePendingTeachers, useApproveTeacher } from '@/hooks/useTeacherApproval'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Loader2 } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'

export default function AdminDashboard() {
  const { data: pendingTeachers, isLoading: isLoadingTeachers } = usePendingTeachers()
  const { mutate: approveTeacher } = useApproveTeacher()
  const [approvingId, setApprovingId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <DashboardPageHeader
          title="Admin Dashboard"
          roleBadge={{
            text: 'Admin',
            className: 'bg-red-100 text-red-800',
          }}
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pending Teacher Approvals
              {pendingTeachers && pendingTeachers.length > 0 && (
                <span className="ml-2 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                  {pendingTeachers.length}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Review and approve teachers who have verified their email addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTeachers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : pendingTeachers && pendingTeachers.length > 0 ? (
              <div className="space-y-4">
                {pendingTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={teacher.name} />
                        <div>
                          <p className="font-semibold text-gray-900">{teacher.name}</p>
                          <p className="text-sm text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setApprovingId(teacher.id)
                        approveTeacher(teacher.id, {
                          onSettled: () => setApprovingId(null),
                        })
                      }}
                      disabled={approvingId === teacher.id}
                      className="ml-4"
                    >
                      {approvingId === teacher.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        'Approve'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No pending teacher approvals at this time.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
