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
  type LucideIcon,
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
    items: [{ title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard }],
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
    items: [{ title: 'Settings', url: '/admin/settings', icon: Settings }],
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
      { title: 'Subjects', url: '/teacher/subjects', icon: BarChart3 },
      { title: 'Batches', url: '/teacher/batches', icon: GraduationCap },
      { title: 'Assignments', url: '/teacher/assignments', icon: ClipboardList },
    ],
  },
  {
    label: 'Planning',
    items: [
      { title: 'Schedule', url: '/teacher/schedule', icon: Calendar },
      { title: 'Resources', url: '/teacher/resources', icon: FolderOpen },
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
    ],
  },
  {
    label: 'Account',
    items: [{ title: 'Settings', url: '/student/settings', icon: Settings }],
  },
]
