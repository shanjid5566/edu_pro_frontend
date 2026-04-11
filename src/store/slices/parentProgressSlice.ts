import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { PARENT_ENDPOINTS } from '@/constants/apiEndpoints';

// Interfaces
export interface ProgressMetrics {
  studentName: string;
  currentGrade: string;
  classRank: {
    rank: number;
    totalStudents: number;
  };
  attendance: number;
  avgScore: number;
}

export interface TimelineData {
  month: string;
  percentage: number;
  grade: string;
}

export interface SubjectData {
  subjectId: string;
  subject: string;
  percentage: number;
  grade: string;
  exams: number;
}

export interface ExamResult {
  id: string;
  subject: string;
  examName: string;
  date: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  trend: 'up' | 'down' | null;
}

export interface ProgressSummary {
  totalExams: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  gradeDistribution: {
    'A+': number;
    'A': number;
    'B+': number;
    'B': number;
    'C': number;
    'D': number;
    'F': number;
  };
}

export interface ParentProgressState {
  metrics: ProgressMetrics | null;
  timeline: TimelineData[];
  subjects: SubjectData[];
  examResults: ExamResult[];
  summary: ProgressSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: ParentProgressState = {
  metrics: null,
  timeline: [],
  subjects: [],
  examResults: [],
  summary: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchProgressMetrics = createAsyncThunk(
  'parentProgress/fetchMetrics',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.PROGRESS_METRICS(studentId));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch metrics');
    }
  },
);

export const fetchProgressTimeline = createAsyncThunk(
  'parentProgress/fetchTimeline',
  async ({ studentId, months = 6 }: { studentId: string; months?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.PROGRESS_TIMELINE(studentId, months));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timeline');
    }
  },
);

export const fetchProgressSubjects = createAsyncThunk(
  'parentProgress/fetchSubjects',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.PROGRESS_SUBJECTS(studentId));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subjects');
    }
  },
);

export const fetchProgressExamResults = createAsyncThunk(
  'parentProgress/fetchExamResults',
  async ({ studentId, limit = 10 }: { studentId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.PROGRESS_EXAM_RESULTS(studentId, limit));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exam results');
    }
  },
);

export const fetchProgressSummary = createAsyncThunk(
  'parentProgress/fetchSummary',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PARENT_ENDPOINTS.PROGRESS_SUMMARY(studentId));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
    }
  },
);

// Slice
const parentProgressSlice = createSlice({
  name: 'parentProgress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Metrics
    builder
      .addCase(fetchProgressMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchProgressMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Timeline
    builder
      .addCase(fetchProgressTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.timeline = action.payload;
      })
      .addCase(fetchProgressTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Subjects
    builder
      .addCase(fetchProgressSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchProgressSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Exam Results
    builder
      .addCase(fetchProgressExamResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressExamResults.fulfilled, (state, action) => {
        state.loading = false;
        state.examResults = action.payload;
      })
      .addCase(fetchProgressExamResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Summary
    builder
      .addCase(fetchProgressSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchProgressSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = parentProgressSlice.actions;
export default parentProgressSlice.reducer;
