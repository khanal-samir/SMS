'use client'

import { AppSidebar } from '@/components/dashboard/app-sidebar'
import {
  adminNavGroups,
  studentNavGroups,
  teacherNavGroups,
} from '@/components/dashboard/nav-config'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ChatWidget } from '@/components/chat/chat-widget'

const NAV_GROUPS = {
  admin: adminNavGroups,
  teacher: teacherNavGroups,
  student: studentNavGroups,
} as const

type DashboardRole = keyof typeof NAV_GROUPS

interface DashboardLayoutProps {
  role: DashboardRole
  children: React.ReactNode
}

export function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const showChat = role === 'admin' || role === 'student'

  return (
    <SidebarProvider>
      <AppSidebar navGroups={NAV_GROUPS[role]} />
      <SidebarInset>{children}</SidebarInset>
      {showChat && <ChatWidget multiGroup={role === 'admin'} />}
    </SidebarProvider>
  )
}
