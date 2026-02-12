'use client'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
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
        </header>
      </div>
    </div>
  )
}
