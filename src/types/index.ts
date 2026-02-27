export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  class: string;
  section: string;
  rollNumber: string;
  parentId: string;
  parentName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  admissionDate: string;
  attendance: number;
  grade: string;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  subjects: string[];
  classes: string[];
  department: string;
  joinDate: string;
  attendance: number;
  classesTaken: number;
  status: 'active' | 'inactive';
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  students: string[];
  address: string;
  occupation: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  section: string;
  classTeacher: string;
  totalStudents: number;
  capacity: number;
  subjects: string[];
}

export interface Exam {
  id: string;
  name: string;
  class: string;
  subject: string;
  date: string;
  duration: string;
  totalMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalParents: number;
  averageAttendance: number;
  averagePerformance: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  children?: NavItem[];
}
