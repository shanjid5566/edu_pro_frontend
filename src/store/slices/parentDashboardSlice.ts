import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { PARENT_ENDPOINTS } from '@/constants/apiEndpoints';

// Interfaces
export interface Child {
  enrollmentId: string;
  studentId: string;
  name: string;
  email: string;
  class: string;
}

export interface OverviewData {
  studentName: string;
  class: string;
  attendance: {
    percentage: number;
    status: string;
  };
  overallGrade: string;
  subjects: number;
  classRank: number;
  totalClassSize: number;
}

export interface AttendanceTrend {
  month: string;
  percentage: number;
  presentDays: number;
  totalDays: number;
}

export interface RecentResult {
  examName: string;
  subject: string;
  date: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
}

export interface SubjectPerformance {
  subjectId: string;
  subject: string;
  percentage: number;
  grade: string;
  exams: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'EVENT' | 'GENERAL' | 'HOLIDAY' | 'EXAM';
  date: string;
  timeAgo: string;
}

export interface ParentDashboardState {
  children: Child[];
  selectedChildId: string | null;
  overview: OverviewData | null;
  attendanceTrend: AttendanceTrend[];
  recentResults: RecentResult[];
  subjectPerformance: SubjectPerformance[];
  upcomingEvents: UpcomingEvent[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: ParentDashboardState = {
  children: [],
  selectedChildId: null,
  overview: null,
  attendanceTrend: [],
  recentResults: [],
  subjectPerformance: [],
  upcomingEvents: [],
  notifications: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchChildren = createAsyncThunk('parentDashboard/fetchChildren', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(PARENT_ENDPOINTS.DASHBOARD);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch children');
  }
});

export const fetchChildOverview = createAsyncThunk(
  'parentDashboard/fetchOverview',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.DASHBOARD_OVERVIEW(studentId));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overview');
    }
  },
);

export const fetchAttendanceTrend = createAsyncThunk(
  'parentDashboard/fetchAttendanceTrend',
  async ({ studentId, months = 6 }: { studentId: string; months?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.DASHBOARD_ATTENDANCE_TREND(studentId, months));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance trend');
    }
  },
);

export const fetchRecentResults = createAsyncThunk(
  'parentDashboard/fetchRecentResults',
  async ({ studentId, limit = 5 }: { studentId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.DASHBOARD_RECENT_RESULTS(studentId, limit));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent results');
    }
  },
);

export const fetchSubjectPerformance = createAsyncThunk(
  'parentDashboard/fetchSubjectPerformance',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.DASHBOARD_SUBJECT_PERFORMANCE(studentId));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subject performance');
    }
  },
);

export const fetchUpcomingEvents = createAsyncThunk(
  'parentDashboard/fetchUpcomingEvents',
  async ({ studentId, limit = 5 }: { studentId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.DASHBOARD_UPCOMING_EVENTS(studentId, limit));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming events');
    }
  },
);

export const fetchNotifications = createAsyncThunk(
  'parentDashboard/fetchNotifications',
  async ({ studentId, limit = 5 }: { studentId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.DASHBOARD_NOTIFICATIONS(studentId, limit));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },
);

// Slice
const parentDashboardSlice = createSlice({
  name: 'parentDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectChild: (state, action) => {
      state.selectedChildId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Children
    builder
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
        if (!state.selectedChildId && action.payload.length > 0) {
          state.selectedChildId = action.payload[0].studentId;
        }
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Overview
    builder
      .addCase(fetchChildOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchChildOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Attendance Trend
    builder
      .addCase(fetchAttendanceTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceTrend = action.payload;
      })
      .addCase(fetchAttendanceTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Recent Results
    builder
      .addCase(fetchRecentResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentResults.fulfilled, (state, action) => {
        state.loading = false;
        state.recentResults = action.payload;
      })
      .addCase(fetchRecentResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Subject Performance
    builder
      .addCase(fetchSubjectPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectPerformance = action.payload;
      })
      .addCase(fetchSubjectPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Upcoming Events
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, selectChild } = parentDashboardSlice.actions;
export default parentDashboardSlice.reducer;
