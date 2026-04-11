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
  DASHBOARD_OVERVIEW: '/api/v1/teacher/dashboard/overview',
  DASHBOARD_ATTENDANCE_TREND: '/api/v1/teacher/dashboard/attendance-trend',
  DASHBOARD_STUDENT_PERFORMANCE: '/api/v1/teacher/dashboard/student-performance',
  CLASSES: '/api/v1/teacher/classes',
  CLASSES_SCHEDULE_TODAY: '/api/v1/teacher/classes/schedule/today',
  CLASS_BY_ID: (classId: string) => `/api/v1/teacher/classes/${classId}`,
  CLASS_STATISTICS: (classId: string) => `/api/v1/teacher/classes/${classId}/statistics`,
  ATTENDANCE: '/api/v1/teacher/attendance',
  ATTENDANCE_STUDENTS: (classId: string) => `/api/v1/teacher/attendance/${classId}/students`,
  ATTENDANCE_MARK: (classId: string) => `/api/v1/teacher/attendance/${classId}/mark`,
  ATTENDANCE_RECORDS: (classId: string) => `/api/v1/teacher/attendance/${classId}/records`,
  ATTENDANCE_STUDENT: (classId: string, studentId: string) => `/api/v1/teacher/attendance/${classId}/student/${studentId}`,
  EXAMS: '/api/v1/teacher/exams',
  EXAM_MARKS: '/api/v1/teacher/exams/marks',
  NOTICES: '/api/v1/teacher/notices',
  NOTICES_PINNED: '/api/v1/teacher/notices/pinned',
  NOTICES_RECENT: '/api/v1/teacher/notices/recent',
  NOTICES_CATEGORY: (category: string) => `/api/v1/teacher/notices/category/${category}`,
  NOTICES_SEARCH: '/api/v1/teacher/notices/search',
  NOTICES_STATISTICS: '/api/v1/teacher/notices/statistics',
  NOTICES_BY_ID: (noticeId: string) => `/api/v1/teacher/notices/${noticeId}`,
};

// Student Endpoints
export const STUDENT_ENDPOINTS = {
  DASHBOARD: '/api/v1/student/dashboard',
  DASHBOARD_OVERVIEW: '/api/v1/student/dashboard/overview',
  DASHBOARD_ATTENDANCE_TREND: '/api/v1/student/dashboard/attendance-trend',
  DASHBOARD_SUBJECT_PERFORMANCE: '/api/v1/student/dashboard/subject-performance',
  DASHBOARD_MY_CLASS: '/api/v1/student/dashboard/my-class',
  DASHBOARD_RECENT_RESULTS: '/api/v1/student/dashboard/recent-results',
  CLASSES: '/api/v1/student/classes',
  CLASSES_SCHEDULE_TODAY: '/api/v1/student/classes/schedule/today',
  CLASSES_SCHEDULE: '/api/v1/student/classes/schedule',
  CLASSES_TIMETABLE: '/api/v1/student/classes/timetable',
  CLASSES_SUBJECT: (subjectId: string) => `/api/v1/student/classes/subject/${subjectId}`,
  EXAMS: '/api/v1/student/exams',
  EXAMS_UPCOMING: '/api/v1/student/exams/upcoming',
  EXAMS_RESULTS: '/api/v1/student/exams/results',
  EXAMS_STATISTICS: '/api/v1/student/exams/statistics',
  EXAMS_STATUS: (status: string) => `/api/v1/student/exams/status/${status}`,
  EXAMS_BY_ID: (examId: string) => `/api/v1/student/exams/${examId}`,
  RESULTS: '/api/v1/student/results',
  RESULTS_SUMMARY: '/api/v1/student/results/summary',
  RESULTS_SUBJECT_PERFORMANCE: '/api/v1/student/results/subject-performance',
  RESULTS_CLASS_COMPARISON: '/api/v1/student/results/class-comparison',
  RESULTS_TREND: (months: number) => `/api/v1/student/results/trend?months=${months}`,
  RESULTS_BY_SUBJECT: (subjectId: string) => `/api/v1/student/results/subject/${subjectId}`,
  ATTENDANCE: '/api/v1/student/attendance',
  FEES: '/api/v1/student/fees',
  FEES_SUMMARY: '/api/v1/student/fees/summary',
  FEES_BY_TYPE: '/api/v1/student/fees/by-type',
  FEES_TIMELINE: (limit: number = 10) => `/api/v1/student/fees/timeline?limit=${limit}`,
  FEES_UPCOMING: '/api/v1/student/fees/upcoming',
  FEES_OVERDUE: '/api/v1/student/fees/overdue',
  FEES_STATUS: (status: string) => `/api/v1/student/fees/status/${status}`,
  NOTICES: '/api/v1/student/notices',
};

// Parent Endpoints
export const PARENT_ENDPOINTS = {
  DASHBOARD: '/api/v1/parent/dashboard',
  DASHBOARD_OVERVIEW: (studentId: string) => `/api/v1/parent/dashboard/${studentId}/overview`,
  DASHBOARD_ATTENDANCE_TREND: (studentId: string, months: number = 6) => `/api/v1/parent/dashboard/${studentId}/attendance-trend?months=${months}`,
  DASHBOARD_RECENT_RESULTS: (studentId: string, limit: number = 5) => `/api/v1/parent/dashboard/${studentId}/recent-results?limit=${limit}`,
  DASHBOARD_SUBJECT_PERFORMANCE: (studentId: string) => `/api/v1/parent/dashboard/${studentId}/subject-performance`,
  DASHBOARD_UPCOMING_EVENTS: (studentId: string, limit: number = 5) => `/api/v1/parent/dashboard/${studentId}/upcoming-events?limit=${limit}`,
  DASHBOARD_NOTIFICATIONS: (studentId: string, limit: number = 5) => `/api/v1/parent/dashboard/${studentId}/notifications?limit=${limit}`,
  PROGRESS_METRICS: (studentId: string) => `/api/v1/parent/child-progress/${studentId}/metrics`,
  PROGRESS_TIMELINE: (studentId: string, months: number = 6) => `/api/v1/parent/child-progress/${studentId}/timeline?months=${months}`,
  PROGRESS_SUBJECTS: (studentId: string) => `/api/v1/parent/child-progress/${studentId}/subjects`,
  PROGRESS_EXAM_RESULTS: (studentId: string, limit: number = 10) => `/api/v1/parent/child-progress/${studentId}/exam-results?limit=${limit}`,
  PROGRESS_SUMMARY: (studentId: string) => `/api/v1/parent/child-progress/${studentId}/summary`,
};
