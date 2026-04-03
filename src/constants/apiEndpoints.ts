// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  PROFILE: '/api/v1/auth/profile',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
};

// Admin Endpoints
export const ADMIN_ENDPOINTS = {
  // Dashboard
  DASHBOARD: '/api/v1/admin/dashboard',
  DASHBOARD_STATS: '/api/v1/admin/dashboard/stats',
  DASHBOARD_ATTENDANCE_TREND: '/api/v1/admin/dashboard/attendance-trend',
  DASHBOARD_PERFORMANCE: '/api/v1/admin/dashboard/performance',
  DASHBOARD_RECENT_ACTIVITY: '/api/v1/admin/dashboard/recent-activity',

  // Students
  STUDENTS: '/api/v1/admin/students',
  STUDENT_BY_ID: (id: string) => `/api/v1/admin/students/${id}`,
  CREATE_STUDENT: '/api/v1/admin/students',
  UPDATE_STUDENT: (id: string) => `/api/v1/admin/students/${id}`,
  DELETE_STUDENT: (id: string) => `/api/v1/admin/students/${id}`,

  // Teachers
  TEACHERS: '/api/v1/admin/teachers',
  TEACHER_BY_ID: (id: string) => `/api/v1/admin/teachers/${id}`,
  CREATE_TEACHER: '/api/v1/admin/teachers',
  UPDATE_TEACHER: (id: string) => `/api/v1/admin/teachers/${id}`,
  DELETE_TEACHER: (id: string) => `/api/v1/admin/teachers/${id}`,

  // Parents
  PARENTS: '/api/v1/admin/parents',
  PARENT_BY_ID: (id: string) => `/api/v1/admin/parents/${id}`,
  CREATE_PARENT: '/api/v1/admin/parents',
  UPDATE_PARENT: (id: string) => `/api/v1/admin/parents/${id}`,
  DELETE_PARENT: (id: string) => `/api/v1/admin/parents/${id}`,

  // Classes
  CLASSES: '/api/v1/admin/classes',
  CLASS_BY_ID: (id: string) => `/api/v1/admin/classes/${id}`,
  CLASS_SCHEDULE: '/api/v1/admin/class-schedule',

  // Exams
  EXAMS: '/api/v1/admin/exams',
  EXAM_BY_ID: (id: string) => `/api/v1/admin/exams/${id}`,

  // Attendance
  ATTENDANCE: '/api/v1/admin/attendance',
};

// Teacher Endpoints
export const TEACHER_ENDPOINTS = {
  DASHBOARD: '/api/v1/teacher/dashboard',
  CLASSES: '/api/v1/teacher/classes',
  ATTENDANCE: '/api/v1/teacher/attendance',
  ATTENDANCE_MARK: '/api/v1/teacher/attendance/mark',
  EXAMS: '/api/v1/teacher/exams',
  EXAM_MARKS: '/api/v1/teacher/exams/marks',
};

// Student Endpoints
export const STUDENT_ENDPOINTS = {
  DASHBOARD: '/api/v1/student/dashboard',
  RESULTS: '/api/v1/student/results',
  ATTENDANCE: '/api/v1/student/attendance',
  FEES: '/api/v1/student/fees',
  NOTICES: '/api/v1/student/notices',
};

// Parent Endpoints
export const PARENT_ENDPOINTS = {
  DASHBOARD: '/api/v1/parent/dashboard',
  CHILDREN: '/api/v1/parent/children',
  CHILD_PROGRESS: (childId: string) => `/api/v1/parent/children/${childId}/progress`,
  CHILD_ATTENDANCE: (childId: string) => `/api/v1/parent/children/${childId}/attendance`,
};
