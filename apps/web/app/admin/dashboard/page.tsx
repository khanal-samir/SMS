'use client'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()

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
