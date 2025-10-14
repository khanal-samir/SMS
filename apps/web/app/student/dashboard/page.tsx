'use client'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">Student</span>
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
              <CardDescription>Manage your personal information</CardDescription>
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

          {/* Courses Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📚 My Courses</CardTitle>
              <CardDescription>View your enrolled courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No courses enrolled yet</p>
              </div>
              <Button className="mt-4 w-full">Browse Courses</Button>
            </CardContent>
          </Card>

          {/* Assignments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📝 Assignments</CardTitle>
              <CardDescription>Check your pending assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No pending assignments</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                View All Assignments
              </Button>
            </CardContent>
          </Card>

          {/* Grades Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📊 Grades</CardTitle>
              <CardDescription>View your academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No grades available</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                View Grades
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📅 Schedule</CardTitle>
              <CardDescription>Your class schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No classes scheduled</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">⚙️ Settings</CardTitle>
              <CardDescription>Account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
