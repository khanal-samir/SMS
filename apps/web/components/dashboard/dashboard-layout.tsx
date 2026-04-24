'use client'

import dynamic from 'next/dynamic'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import {
  adminNavGroups,
  studentNavGroups,
  teacherNavGroups,
} from '@/components/dashboard/nav-config'
import { ChatSocketProvider } from '@/components/chat/chat-socket-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const ChatWidget = dynamic(
  () => import('@/components/chat/chat-widget').then((module) => module.ChatWidget),
  { ssr: false },
)

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
      {showChat ? <ChatSocketProvider /> : null}
      {showChat ? <ChatWidget multiGroup={role === 'admin'} /> : null}
    </SidebarProvider>
  )
}
