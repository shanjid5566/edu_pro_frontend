import { create } from 'zustand';
import { User, UserRole, Notification } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  markNotificationRead: (id: string) => void;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'New Student Enrolled', message: 'Sarah Johnson has been enrolled in Class 10-A', type: 'info', read: false, createdAt: '2 min ago' },
  { id: '2', title: 'Exam Results Published', message: 'Mid-term results for Class 9 are now available', type: 'success', read: false, createdAt: '15 min ago' },
  { id: '3', title: 'Low Attendance Alert', message: 'Class 8-B has attendance below 75% today', type: 'warning', read: false, createdAt: '1 hour ago' },
  { id: '4', title: 'Parent Meeting Scheduled', message: 'PTA meeting on March 15th at 10:00 AM', type: 'info', read: true, createdAt: '3 hours ago' },
];

const mockUsers: Record<UserRole, User> = {
  admin: { id: '1', name: 'John Anderson', email: 'admin@school.com', role: 'admin', phone: '+1 234 567 890' },
  teacher: { id: '2', name: 'Emily Carter', email: 'teacher@school.com', role: 'teacher', phone: '+1 234 567 891' },
  student: { id: '3', name: 'Alex Thompson', email: 'student@school.com', role: 'student', phone: '+1 234 567 892' },
  parent: { id: '4', name: 'Michael Davis', email: 'parent@school.com', role: 'parent', phone: '+1 234 567 893' },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  theme: 'light',
  sidebarOpen: true,
  notifications: mockNotifications,
  login: (_email, _password, role) => {
    const user = mockUsers[role];
    set({ user, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    return { theme: newTheme };
  }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
}));
