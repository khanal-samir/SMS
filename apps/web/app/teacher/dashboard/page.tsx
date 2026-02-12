'use client'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const { mutate: logout, isPending } = useLogout()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mx-auto max-w-6xl">
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
      </header>

      <h1 className="mt-6 text-xl font-semibold">Work In Progress for Teacher</h1>
    </div>
  )
}
