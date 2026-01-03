'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'
import { usePendingTeachers, useApproveTeacher } from '@/hooks/useTeacherApproval'
import { Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()
  const { data: pendingTeachers, isLoading: isLoadingTeachers } = usePendingTeachers()
  const { mutate: approveTeacher } = useApproveTeacher()
  const [approvingId, setApprovingId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-800">Admin</span>
            <Button onClick={() => logout()} disabled={isPending} variant="outline">
              {isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👨‍🏫 Pending Teacher Approvals
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <span className="text-sm font-semibold">
                            {teacher.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
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

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">👤 Profile</CardTitle>
              <CardDescription>Manage your admin account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Role:</strong> {user?.role}
                </p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* User Management Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">👥 User Management</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Manage students, teachers, and admins</p>
              </div>
              <Button className="mt-4 w-full">Manage Users</Button>
            </CardContent>
          </Card>

          {/* System Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">⚙️ System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Database, authentication, and app settings</p>
              </div>
              <Button className="mt-4 w-full">System Settings</Button>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📊 Analytics</CardTitle>
              <CardDescription>View system analytics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">User activity, performance metrics</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Courses Management Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📚 Course Management</CardTitle>
              <CardDescription>Manage all courses in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Create, edit, and organize courses</p>
              </div>
              <Button className="mt-4 w-full">Manage Courses</Button>
            </CardContent>
          </Card>

          {/* Database Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🗄️ Database</CardTitle>
              <CardDescription>Database management and backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Backup, restore, and maintenance</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                Database Tools
              </Button>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔒 Security</CardTitle>
              <CardDescription>Security settings and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Access logs, security policies</p>
              </div>
              <Button className="mt-4 w-full">Security Settings</Button>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📢 Notifications</CardTitle>
              <CardDescription>System-wide notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Send announcements to all users</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                Send Notification
              </Button>
            </CardContent>
          </Card>

          {/* Logs Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📋 System Logs</CardTitle>
              <CardDescription>View system logs and errors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Monitor system activity and errors</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                View Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
