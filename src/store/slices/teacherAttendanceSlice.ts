import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { TEACHER_ENDPOINTS } from '@/constants/apiEndpoints';

export interface AttendanceStudent {
  studentId: string;
  name: string;
  rollNumber: string;
  email: string;
}

export interface AttendanceClass {
  id: string;
  name: string;
  section: string;
}

export interface ClassAttendanceData {
  class: AttendanceClass;
  students: AttendanceStudent[];
  totalStudents: number;
}

export interface AttendanceRecord {
  studentId: string;
  name: string;
  rollNumber: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface DailyAttendanceRecord {
  date: string;
  records: AttendanceRecord[];
  total: number;
  present: number;
  absent: number;
  late: number;
}

export interface StudentAttendanceStats {
  studentId: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

export interface TeacherAssignedClass {
  classId: string;
  className: string;
  studentCount: number;
}

interface TeacherAttendanceState {
  assignedClasses: TeacherAssignedClass[];
  currentClassData: ClassAttendanceData | null;
  attendanceRecords: DailyAttendanceRecord[];
  studentStats: StudentAttendanceStats | null;
  loading: boolean;
  recordsLoading: boolean;
  marking: boolean;
  error: string | null;
}

const initialState: TeacherAttendanceState = {
  assignedClasses: [],
  currentClassData: null,
  attendanceRecords: [],
  studentStats: null,
  loading: false,
  recordsLoading: false,
  marking: false,
  error: null,
};

export const fetchTeacherClassesForAttendance = createAsyncThunk(
  'teacherAttendance/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.CLASSES);
      return response.data.data.allClasses as TeacherAssignedClass[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);

export const fetchClassStudents = createAsyncThunk(
  'teacherAttendance/fetchClassStudents',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.ATTENDANCE_STUDENTS(classId));
      return response.data.data as ClassAttendanceData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class students');
    }
  }
);

export const markAttendance = createAsyncThunk(
  'teacherAttendance/markAttendance',
  async (
    {
      classId,
      attendanceData,
      date,
    }: {
      classId: string;
      attendanceData: Array<{ studentId: string; status: string }>;
      date: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(TEACHER_ENDPOINTS.ATTENDANCE_MARK(classId), {
        attendanceData,
        date,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark attendance');
    }
  }
);

export const fetchAttendanceRecords = createAsyncThunk(
  'teacherAttendance/fetchRecords',
  async (
    { classId, startDate, endDate }: { classId: string; startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.ATTENDANCE_RECORDS(classId), {
        params: { startDate, endDate },
      });
      return response.data.data as DailyAttendanceRecord[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch records');
    }
  }
);

export const fetchStudentAttendanceStats = createAsyncThunk(
  'teacherAttendance/fetchStudentStats',
  async ({ classId, studentId }: { classId: string; studentId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.ATTENDANCE_STUDENT(classId, studentId));
      return response.data.data as StudentAttendanceStats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student stats');
    }
  }
);

const teacherAttendanceSlice = createSlice({
  name: 'teacherAttendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentClassData: (state) => {
      state.currentClassData = null;
      state.studentStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchTeacherClassesForAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherClassesForAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedClasses = action.payload;
      })
      .addCase(fetchTeacherClassesForAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Class Students
      .addCase(fetchClassStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClassData = action.payload;
      })
      .addCase(fetchClassStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.marking = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state) => {
        state.marking = false;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.marking = false;
        state.error = action.payload as string;
      })
      // Fetch Records
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.recordsLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.recordsLoading = false;
        state.attendanceRecords = action.payload;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.recordsLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Student Stats
      .addCase(fetchStudentAttendanceStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.studentStats = action.payload;
      })
      .addCase(fetchStudentAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentClassData } = teacherAttendanceSlice.actions;
export default teacherAttendanceSlice.reducer;
