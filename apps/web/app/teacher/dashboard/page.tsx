'use client'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const router = useRouter()
  const { mutate: logout, isPending } = useLogout()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-800">Teacher</span>
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

          {/* My Classes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📚 My Classes</CardTitle>
              <CardDescription>Manage your teaching classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No classes assigned yet</p>
              </div>
              <Button className="mt-4 w-full">Manage Classes</Button>
            </CardContent>
          </Card>

          {/* Students Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">👥 My Students</CardTitle>
              <CardDescription>View and manage your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No students enrolled</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                View Students
              </Button>
            </CardContent>
          </Card>

          {/* Batches Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🎓 Batches</CardTitle>
              <CardDescription>View student batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">View batches and their enrolled students</p>
              </div>
              <Button
                className="mt-4 w-full"
                variant="outline"
                onClick={() => router.push('/teacher/batches')}
              >
                View Batches
              </Button>
            </CardContent>
          </Card>

          {/* Assignments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📝 Assignments</CardTitle>
              <CardDescription>Create and manage assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No assignments created</p>
              </div>
              <Button className="mt-4 w-full">Create Assignment</Button>
            </CardContent>
          </Card>

          {/* Grades Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📊 Grade Book</CardTitle>
              <CardDescription>Manage student grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No grades to manage</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                Grade Students
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📅 Schedule</CardTitle>
              <CardDescription>Your teaching schedule</CardDescription>
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

          {/* Resources Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📁 Resources</CardTitle>
              <CardDescription>Teaching materials and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No resources uploaded</p>
              </div>
              <Button className="mt-4 w-full">Upload Resources</Button>
            </CardContent>
          </Card>

          {/* Reports Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📈 Reports</CardTitle>
              <CardDescription>Class performance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No reports available</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                View Reports
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
