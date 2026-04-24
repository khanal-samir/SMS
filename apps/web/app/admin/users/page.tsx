'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { UserListTable } from '@/components/admin/user-list-table'
import { useUsersByRole } from '@/hooks/useUser'
import type { UserTabType } from '@/types/user-tabs'
import { cn } from '@/lib/utils'

const TABS: { key: UserTabType; label: string }[] = [
  { key: 'students', label: 'Students' },
  { key: 'teachers', label: 'Teachers' },
  { key: 'admins', label: 'Admins' },
]

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<UserTabType>('students')
  const { teachers, students, admins, isLoading } = useUsersByRole()

  const usersByTab = {
    teachers,
    students,
    admins,
  }

  const countByTab: Record<UserTabType, number> = {
    students: students?.length ?? 0,
    teachers: teachers?.length ?? 0,
    admins: admins?.length ?? 0,
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/dashboard', label: 'Dashboard' }}
          title="User Management"
          description="View and manage users by role"
        />

        <div className="mb-8 flex gap-1 rounded-xl border bg-muted/40 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'tabular-nums rounded-full px-2 py-0.5 text-xs font-medium',
                  activeTab === tab.key
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {countByTab[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <UserListTable
          users={usersByTab[activeTab]}
          isLoading={isLoading}
          emptyMessage={`No ${activeTab} found.`}
          activeTab={activeTab}
        />
      </div>
    </div>
  )
}
