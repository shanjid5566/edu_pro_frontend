import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { STUDENT_ENDPOINTS } from '@/constants/apiEndpoints';

export interface DashboardStatistic {
  count?: number;
  label?: string;
  percentage?: number;
  grade?: string;
  rank?: number;
  outOf?: number;
  change?: string;
  status?: string;
}

export interface StudentDashboardOverview {
  greeting: string;
  statistics: {
    mySubjects: DashboardStatistic;
    attendance: DashboardStatistic;
    overallGrade: DashboardStatistic;
    rank: DashboardStatistic;
  };
}

export interface AttendanceTrendPoint {
  month: string;
  attendance: number;
}

export interface SubjectPerformancePoint {
  subject: string;
  percentage: number;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface MyClassData {
  classId: string;
  className: string;
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  teachers: Teacher[];
  subjects: Subject[];
}

export interface RecentResult {
  examId: string;
  examName: string;
  subject: string;
  class: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  date: string;
}

interface StudentDashboardState {
  overview: StudentDashboardOverview | null;
  attendanceTrend: AttendanceTrendPoint[];
  subjectPerformance: SubjectPerformancePoint[];
  myClass: MyClassData | null;
  recentResults: RecentResult[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentDashboardState = {
  overview: null,
  attendanceTrend: [],
  subjectPerformance: [],
  myClass: null,
  recentResults: [],
  loading: false,
  error: null,
};

export const fetchStudentDashboardOverview = createAsyncThunk(
  'studentDashboard/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.DASHBOARD_OVERVIEW);
      return response.data.data as StudentDashboardOverview;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard overview');
    }
  }
);

export const fetchAttendanceTrend = createAsyncThunk(
  'studentDashboard/fetchAttendanceTrend',
  async (months: number = 6, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.DASHBOARD_ATTENDANCE_TREND, {
        params: { months },
      });
      return response.data.data as AttendanceTrendPoint[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance trend');
    }
  }
);

export const fetchSubjectPerformance = createAsyncThunk(
  'studentDashboard/fetchSubjectPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.DASHBOARD_SUBJECT_PERFORMANCE);
      return response.data.data as SubjectPerformancePoint[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subject performance');
    }
  }
);

export const fetchMyClass = createAsyncThunk(
  'studentDashboard/fetchMyClass',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.DASHBOARD_MY_CLASS);
      return response.data.data as MyClassData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my class');
    }
  }
);

export const fetchRecentResults = createAsyncThunk(
  'studentDashboard/fetchRecentResults',
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.DASHBOARD_RECENT_RESULTS, {
        params: { limit },
      });
      return response.data.data as RecentResult[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent results');
    }
  }
);

const studentDashboardSlice = createSlice({
  name: 'studentDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchStudentDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAttendanceTrend.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendanceTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceTrend = action.payload;
      })
      .addCase(fetchAttendanceTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubjectPerformance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjectPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectPerformance = action.payload;
      })
      .addCase(fetchSubjectPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyClass.fulfilled, (state, action) => {
        state.loading = false;
        state.myClass = action.payload;
      })
      .addCase(fetchMyClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRecentResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentResults.fulfilled, (state, action) => {
        state.loading = false;
        state.recentResults = action.payload;
      })
      .addCase(fetchRecentResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentDashboardSlice.reducer;
