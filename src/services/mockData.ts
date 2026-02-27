import { Student, Teacher, DashboardStats } from '@/types';

export const mockStats: DashboardStats = {
  totalStudents: 1247,
  totalTeachers: 86,
  totalClasses: 42,
  totalParents: 982,
  averageAttendance: 94.2,
  averagePerformance: 78.5,
};

export const mockStudents: Student[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@school.com', class: '10', section: 'A', rollNumber: '101', parentId: '1', parentName: 'Michael Johnson', phone: '+1 555 0101', address: '123 Oak St', dateOfBirth: '2008-03-15', gender: 'female', admissionDate: '2020-04-01', attendance: 96, grade: 'A', status: 'active' },
  { id: '2', name: 'James Williams', email: 'james@school.com', class: '10', section: 'A', rollNumber: '102', parentId: '2', parentName: 'Robert Williams', phone: '+1 555 0102', address: '456 Elm St', dateOfBirth: '2008-07-22', gender: 'male', admissionDate: '2020-04-01', attendance: 89, grade: 'B+', status: 'active' },
  { id: '3', name: 'Emma Davis', email: 'emma@school.com', class: '9', section: 'B', rollNumber: '201', parentId: '3', parentName: 'Thomas Davis', phone: '+1 555 0103', address: '789 Pine St', dateOfBirth: '2009-11-08', gender: 'female', admissionDate: '2021-04-01', attendance: 92, grade: 'A-', status: 'active' },
  { id: '4', name: 'Liam Martinez', email: 'liam@school.com', class: '9', section: 'A', rollNumber: '202', parentId: '4', parentName: 'Carlos Martinez', phone: '+1 555 0104', address: '321 Cedar St', dateOfBirth: '2009-01-30', gender: 'male', admissionDate: '2021-04-01', attendance: 78, grade: 'B', status: 'active' },
  { id: '5', name: 'Olivia Brown', email: 'olivia@school.com', class: '8', section: 'A', rollNumber: '301', parentId: '5', parentName: 'David Brown', phone: '+1 555 0105', address: '654 Maple St', dateOfBirth: '2010-05-12', gender: 'female', admissionDate: '2022-04-01', attendance: 97, grade: 'A+', status: 'active' },
  { id: '6', name: 'Noah Wilson', email: 'noah@school.com', class: '8', section: 'B', rollNumber: '302', parentId: '6', parentName: 'Steven Wilson', phone: '+1 555 0106', address: '987 Birch St', dateOfBirth: '2010-09-25', gender: 'male', admissionDate: '2022-04-01', attendance: 85, grade: 'B+', status: 'active' },
  { id: '7', name: 'Ava Taylor', email: 'ava@school.com', class: '7', section: 'A', rollNumber: '401', parentId: '7', parentName: 'Kevin Taylor', phone: '+1 555 0107', address: '147 Walnut St', dateOfBirth: '2011-12-03', gender: 'female', admissionDate: '2023-04-01', attendance: 91, grade: 'A', status: 'active' },
  { id: '8', name: 'Ethan Moore', email: 'ethan@school.com', class: '10', section: 'B', rollNumber: '103', parentId: '8', parentName: 'Brian Moore', phone: '+1 555 0108', address: '258 Spruce St', dateOfBirth: '2008-06-17', gender: 'male', admissionDate: '2020-04-01', attendance: 73, grade: 'C+', status: 'inactive' },
];

export const mockTeachers: Teacher[] = [
  { id: '1', name: 'Emily Carter', email: 'emily@school.com', phone: '+1 555 1001', subjects: ['Mathematics', 'Physics'], classes: ['10-A', '10-B', '9-A'], department: 'Science', joinDate: '2018-08-15', attendance: 98, classesTaken: 342, status: 'active' },
  { id: '2', name: 'David Park', email: 'david@school.com', phone: '+1 555 1002', subjects: ['English Literature', 'Creative Writing'], classes: ['9-A', '9-B', '8-A'], department: 'Language Arts', joinDate: '2019-01-10', attendance: 95, classesTaken: 289, status: 'active' },
  { id: '3', name: 'Rachel Kim', email: 'rachel@school.com', phone: '+1 555 1003', subjects: ['Biology', 'Chemistry'], classes: ['10-A', '9-B'], department: 'Science', joinDate: '2020-03-20', attendance: 92, classesTaken: 215, status: 'active' },
  { id: '4', name: 'Michael Chen', email: 'michael@school.com', phone: '+1 555 1004', subjects: ['History', 'Geography'], classes: ['8-A', '8-B', '7-A'], department: 'Social Studies', joinDate: '2017-07-01', attendance: 97, classesTaken: 410, status: 'active' },
  { id: '5', name: 'Lisa Anderson', email: 'lisa@school.com', phone: '+1 555 1005', subjects: ['Computer Science'], classes: ['10-A', '10-B', '9-A', '9-B'], department: 'Technology', joinDate: '2021-06-15', attendance: 94, classesTaken: 178, status: 'active' },
  { id: '6', name: 'James Wright', email: 'jwright@school.com', phone: '+1 555 1006', subjects: ['Physical Education'], classes: ['7-A', '8-A', '8-B'], department: 'Sports', joinDate: '2019-09-01', attendance: 88, classesTaken: 256, status: 'active' },
];
export const mockAttendanceData = [
  { month: 'Sep', attendance: 95 },
  { month: 'Oct', attendance: 92 },
  { month: 'Nov', attendance: 88 },
  { month: 'Dec', attendance: 90 },
  { month: 'Jan', attendance: 94 },
  { month: 'Feb', attendance: 96 },
];

export const mockPerformanceData = [
  { subject: 'Math', average: 82 },
  { subject: 'Science', average: 78 },
  { subject: 'English', average: 85 },
  { subject: 'History', average: 74 },
  { subject: 'CS', average: 90 },
];

export const mockRevenueData = [
  { month: 'Sep', revenue: 45000 },
  { month: 'Oct', revenue: 52000 },
  { month: 'Nov', revenue: 48000 },
  { month: 'Dec', revenue: 61000 },
  { month: 'Jan', revenue: 55000 },
  { month: 'Feb', revenue: 67000 },
];
