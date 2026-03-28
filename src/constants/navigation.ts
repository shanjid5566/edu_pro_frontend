import { NavItem } from '@/types';

export const navigationItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard', roles: ['admin'] },
  { title: 'Students', href: '/admin/students', icon: 'GraduationCap', roles: ['admin'] },
  { title: 'Teachers', href: '/admin/teachers', icon: 'Users', roles: ['admin'] },
  { title: 'Parents', href: '/admin/parents', icon: 'UserCheck', roles: ['admin'] },
  { title: 'Classes', href: '/admin/classes', icon: 'School', roles: ['admin'] },
  { title: 'Class Schedule', href: '/admin/schedule', icon: 'Calendar', roles: ['admin'] },
  { title: 'Exams', href: '/admin/exams', icon: 'FileText', roles: ['admin'] },
  { title: 'Attendance', href: '/admin/attendance', icon: 'ClipboardCheck', roles: ['admin'] },
  { title: 'Notice Board', href: '/admin/notices', icon: 'Megaphone', roles: ['admin'] },
  { title: 'Chat', href: '/admin/chat', icon: 'MessageSquare', roles: ['admin'] },
  { title: 'Settings', href: '/admin/settings', icon: 'Settings', roles: ['admin'] },

  { title: 'Dashboard', href: '/teacher/dashboard', icon: 'LayoutDashboard', roles: ['teacher'] },
  { title: 'My Classes', href: '/teacher/classes', icon: 'School', roles: ['teacher'] },
  { title: 'Attendance', href: '/teacher/attendance', icon: 'ClipboardCheck', roles: ['teacher'] },
  { title: 'Exams', href: '/teacher/exams', icon: 'FileText', roles: ['teacher'] },
  { title: 'Notice Board', href: '/teacher/notices', icon: 'Megaphone', roles: ['teacher'] },
  { title: 'Chat', href: '/teacher/chat', icon: 'MessageSquare', roles: ['teacher'] },

  { title: 'Dashboard', href: '/student/dashboard', icon: 'LayoutDashboard', roles: ['student'] },
  { title: 'My Classes', href: '/student/classes', icon: 'School', roles: ['student'] },
  { title: 'Exams', href: '/student/exams', icon: 'FileText', roles: ['student'] },
  { title: 'Results', href: '/student/results', icon: 'Award', roles: ['student'] },
  { title: 'Fees', href: '/student/fees', icon: 'CreditCard', roles: ['student'] },
  { title: 'Notice Board', href: '/student/notices', icon: 'Megaphone', roles: ['student'] },
  { title: 'Chat', href: '/student/chat', icon: 'MessageSquare', roles: ['student'] },

  { title: 'Dashboard', href: '/parent/dashboard', icon: 'LayoutDashboard', roles: ['parent'] },
  { title: "Child's Progress", href: '/parent/progress', icon: 'TrendingUp', roles: ['parent'] },
  { title: 'Attendance', href: '/parent/attendance', icon: 'ClipboardCheck', roles: ['parent'] },
  { title: 'Fees', href: '/parent/fees', icon: 'CreditCard', roles: ['parent'] },
  { title: 'Notice Board', href: '/parent/notices', icon: 'Megaphone', roles: ['parent'] },
  { title: 'Chat', href: '/parent/chat', icon: 'MessageSquare', roles: ['parent'] },
];
