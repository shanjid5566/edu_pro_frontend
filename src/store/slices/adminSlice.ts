import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ADMIN_ENDPOINTS } from '@/constants/apiEndpoints';

// Types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalParents: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  rollNumber: string;
  status: 'active' | 'inactive';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  status: 'active' | 'inactive';
}

export interface AdminClass {
  id: string;
  name: string;
  section: string;
  classTeacher: string;
  totalStudents: number;
  capacity: number;
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

interface AdminState {
  // Dashboard
  stats: DashboardStats | null;
  attendanceData: any[];
  performanceData: any[];
  recentActivity: any[];

  // Lists
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  classes: AdminClass[];
  exams: Exam[];
  attendance: any[];

  // Pagination
  studentsPagination: { page: number; limit: number; total: number };
  teachersPagination: { page: number; limit: number; total: number };
  parentsPagination: { page: number; limit: number; total: number };

  // State
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  attendanceData: [],
  performanceData: [],
  recentActivity: [],
  students: [],
  teachers: [],
  parents: [],
  classes: [],
  exams: [],
  attendance: [],
  studentsPagination: { page: 1, limit: 10, total: 0 },
  teachersPagination: { page: 1, limit: 10, total: 0 },
  parentsPagination: { page: 1, limit: 10, total: 0 },
  loading: false,
  error: null,
};

// Dashboard Thunks
export const fetchDashboard = createAsyncThunk(
  'admin/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.DASHBOARD);
      console.log('Dashboard Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

// Students Thunks
export const fetchStudents = createAsyncThunk(
  'admin/fetchStudents',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.STUDENTS, { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const createStudent = createAsyncThunk(
  'admin/createStudent',
  async (studentData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ADMIN_ENDPOINTS.STUDENTS, studentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create student');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'admin/deleteStudent',
  async (studentId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ADMIN_ENDPOINTS.STUDENT_DETAIL(studentId));
      return studentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete student');
    }
  }
);

// Teachers Thunks
export const fetchTeachers = createAsyncThunk(
  'admin/fetchTeachers',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.TEACHERS, { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teachers');
    }
  }
);

export const createTeacher = createAsyncThunk(
  'admin/createTeacher',
  async (teacherData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ADMIN_ENDPOINTS.TEACHERS, teacherData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create teacher');
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  'admin/deleteTeacher',
  async (teacherId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ADMIN_ENDPOINTS.TEACHER_DETAIL(teacherId));
      return teacherId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete teacher');
    }
  }
);

// Parents Thunks
export const fetchParents = createAsyncThunk(
  'admin/fetchParents',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.PARENTS, { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parents');
    }
  }
);

export const createParent = createAsyncThunk(
  'admin/createParent',
  async (parentData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ADMIN_ENDPOINTS.PARENTS, parentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create parent');
    }
  }
);

export const deleteParent = createAsyncThunk(
  'admin/deleteParent',
  async (parentId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ADMIN_ENDPOINTS.PARENT_DETAIL(parentId));
      return parentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete parent');
    }
  }
);

export const updateParent = createAsyncThunk(
  'admin/updateParent',
  async ({ id, data }: { id: string; data: Partial<Parent> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(ADMIN_ENDPOINTS.PARENT_DETAIL(id), data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update parent');
    }
  }
);

// Classes Thunks
export const fetchClasses = createAsyncThunk(
  'admin/fetchClasses',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.CLASSES, { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);

export const createClass = createAsyncThunk(
  'admin/createClass',
  async (classData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ADMIN_ENDPOINTS.CLASSES, classData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create class');
    }
  }
);

export const deleteClass = createAsyncThunk(
  'admin/deleteClass',
  async (classId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ADMIN_ENDPOINTS.CLASS_DETAIL(classId));
      return classId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete class');
    }
  }
);

// Exams Thunks
export const fetchExams = createAsyncThunk(
  'admin/fetchExams',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.EXAMS, { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exams');
    }
  }
);

export const createExam = createAsyncThunk(
  'admin/createExam',
  async (examData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ADMIN_ENDPOINTS.EXAMS, examData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create exam');
    }
  }
);

export const deleteExam = createAsyncThunk(
  'admin/deleteExam',
  async (examId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ADMIN_ENDPOINTS.EXAM_DETAIL(examId));
      return examId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete exam');
    }
  }
);

// Attendance Thunks
export const fetchAttendance = createAsyncThunk(
  'admin/fetchAttendance',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.ATTENDANCE, { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard - fetch all data at once
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.attendanceData = action.payload.attendanceTrend || [];
        state.performanceData = action.payload.performance || [];
        state.recentActivity = action.payload.recentActivity || [];
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Students
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data || [];
        if (action.payload.pagination) {
          state.studentsPagination = action.payload.pagination;
        }
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.unshift(action.payload);
      });

    builder
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s.id !== action.payload);
      });

    // Teachers
    builder
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.teachers = action.payload.data || [];
        if (action.payload.pagination) {
          state.teachersPagination = action.payload.pagination;
        }
      });

    builder
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.teachers.unshift(action.payload);
      });

    builder
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter((t) => t.id !== action.payload);
      });

    // Parents
    builder
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.parents = action.payload.data || [];
        if (action.payload.pagination) {
          state.parentsPagination = action.payload.pagination;
        }
      });

    builder
      .addCase(createParent.fulfilled, (state, action) => {
        state.parents.unshift(action.payload);
      });

    builder
      .addCase(deleteParent.fulfilled, (state, action) => {
        state.parents = state.parents.filter((p) => p.id !== action.payload);
      });

    builder
      .addCase(updateParent.fulfilled, (state, action) => {
        const index = state.parents.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.parents[index] = action.payload;
        }
      });

    // Classes
    builder
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.classes = action.payload.data || [];
      });

    builder
      .addCase(createClass.fulfilled, (state, action) => {
        state.classes.unshift(action.payload);
      });

    builder
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter((c) => c.id !== action.payload);
      });

    // Exams
    builder
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload.data || [];
      });

    builder
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.unshift(action.payload);
      });

    builder
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter((e) => e.id !== action.payload);
      });

    // Attendance
    builder
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.attendance = action.payload.data || [];
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
