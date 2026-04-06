import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { TEACHER_ENDPOINTS } from '@/constants/apiEndpoints';

interface DashboardStatistic {
  count?: number;
  label?: string;
  today?: number;
  change?: string;
  percentage?: number;
}

export interface TeacherDashboardOverview {
  greeting: string;
  statistics: {
    myClasses: DashboardStatistic;
    totalStudents: DashboardStatistic;
    classesTaken: DashboardStatistic;
    avgPerformance: DashboardStatistic;
  };
}

export interface TeacherAttendanceTrendPoint {
  month: string;
  attendance: number;
}

export interface TeacherPerformancePoint {
  subject: string;
  percentage: number;
}

interface TeacherDashboardState {
  overview: TeacherDashboardOverview | null;
  attendanceTrend: TeacherAttendanceTrendPoint[];
  studentPerformance: TeacherPerformancePoint[];
  loading: boolean;
  error: string | null;
}

const initialState: TeacherDashboardState = {
  overview: null,
  attendanceTrend: [],
  studentPerformance: [],
  loading: false,
  error: null,
};

export const fetchTeacherDashboardOverview = createAsyncThunk(
  'teacherDashboard/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.DASHBOARD_OVERVIEW);
      return response.data.data as TeacherDashboardOverview;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard overview');
    }
  }
);

export const fetchTeacherAttendanceTrend = createAsyncThunk(
  'teacherDashboard/fetchAttendanceTrend',
  async (months: number = 6, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.DASHBOARD_ATTENDANCE_TREND, {
        params: { months },
      });
      return response.data.data as TeacherAttendanceTrendPoint[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance trend');
    }
  }
);

export const fetchTeacherStudentPerformance = createAsyncThunk(
  'teacherDashboard/fetchStudentPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.DASHBOARD_STUDENT_PERFORMANCE);
      return response.data.data as TeacherPerformancePoint[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student performance');
    }
  }
);

const teacherDashboardSlice = createSlice({
  name: 'teacherDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchTeacherDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeacherAttendanceTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherAttendanceTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceTrend = action.payload;
      })
      .addCase(fetchTeacherAttendanceTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeacherStudentPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherStudentPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.studentPerformance = action.payload;
      })
      .addCase(fetchTeacherStudentPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teacherDashboardSlice.reducer;
