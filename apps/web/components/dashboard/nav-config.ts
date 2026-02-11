import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  ClipboardList,
  Calendar,
  FolderOpen,
  FileText,
  type LucideIcon,
  Shield,
  Bell,
  Database,
  ScrollText,
} from 'lucide-react'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const adminNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
      { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Management',
    items: [
      { title: 'Users', url: '/admin/users', icon: Users },
      { title: 'Batches', url: '/admin/batches', icon: GraduationCap },
      { title: 'Courses', url: '/admin/courses', icon: BookOpen },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'Settings', url: '/admin/settings', icon: Settings },
      { title: 'Security', url: '/admin/security', icon: Shield },
      { title: 'Notifications', url: '/admin/notifications', icon: Bell },
      { title: 'Database', url: '/admin/database', icon: Database },
      { title: 'Logs', url: '/admin/logs', icon: ScrollText },
    ],
  },
]

export const teacherNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ title: 'Dashboard', url: '/teacher/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Teaching',
    items: [
      { title: 'My Classes', url: '/teacher/classes', icon: BookOpen },
      { title: 'Students', url: '/teacher/students', icon: Users },
      { title: 'Batches', url: '/teacher/batches', icon: GraduationCap },
      { title: 'Assignments', url: '/teacher/assignments', icon: ClipboardList },
      { title: 'Grade Book', url: '/teacher/grades', icon: FileText },
    ],
  },
  {
    label: 'Planning',
    items: [
      { title: 'Schedule', url: '/teacher/schedule', icon: Calendar },
      { title: 'Resources', url: '/teacher/resources', icon: FolderOpen },
      { title: 'Reports', url: '/teacher/reports', icon: BarChart3 },
      { title: 'Settings', url: '/teacher/settings', icon: Settings },
    ],
  },
]

export const studentNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ title: 'Dashboard', url: '/student/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Academics',
    items: [
      { title: 'Courses', url: '/student/courses', icon: BookOpen },
      { title: 'Assignments', url: '/student/assignments', icon: ClipboardList },
      { title: 'Grades', url: '/student/grades', icon: FileText },
      { title: 'Schedule', url: '/student/schedule', icon: Calendar },
    ],
  },
  {
    label: 'Account',
    items: [{ title: 'Settings', url: '/student/settings', icon: Settings }],
  },
]
