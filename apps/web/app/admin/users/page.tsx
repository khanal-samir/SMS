'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { UserListTable } from '@/components/admin/user-list-table'
import { useUsersByRole } from '@/hooks/useUser'
import type { UserTabType } from '@/types/user-tabs'

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/dashboard', label: 'Dashboard' }}
          title="User Management"
          description="View and manage users by role"
        />

        <div className="mb-6 flex gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
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
