import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { STUDENT_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Exam {
  id: string;
  name: string;
  subject: string;
  subjectId?: string;
  class: string;
  date: string;
  time: string;
  totalMarks: number;
  type: 'HALF_YEARLY' | 'QUARTERLY' | 'MONTHLY' | 'UNIT_TEST';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  marksObtained?: number | null;
  percentage?: number | null;
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  subject: string;
  class: string;
  date: string;
  type: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
}

export interface ExamSummary {
  total: number;
  upcomingCount: number;
  ongoingCount: number;
  completedCount: number;
}

export interface ExamsData {
  upcoming: Exam[];
  ongoing: Exam[];
  completed: Exam[];
  summary: ExamSummary;
}

export interface ExamStatistics {
  totalExams: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
}

export interface ExamDetail {
  id: string;
  name: string;
  subject: string;
  subjectId?: string;
  class: string;
  date: string;
  time: string;
  totalMarks: number;
  type: string;
  status: string;
  result?: ExamResult | null;
}

interface StudentExamsState {
  allExams: ExamsData | null;
  upcomingExams: Exam[];
  results: ExamResult[];
  statistics: ExamStatistics | null;
  selectedExam: ExamDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentExamsState = {
  allExams: null,
  upcomingExams: [],
  results: [],
  statistics: null,
  selectedExam: null,
  loading: false,
  error: null,
};

export const fetchStudentExams = createAsyncThunk(
  'studentExams/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.EXAMS);
      return response.data.data as ExamsData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exams');
    }
  }
);

export const fetchUpcomingExams = createAsyncThunk(
  'studentExams/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.EXAMS_UPCOMING);
      return response.data.data as Exam[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming exams');
    }
  }
);

export const fetchExamResults = createAsyncThunk(
  'studentExams/fetchResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.EXAMS_RESULTS);
      return response.data.data as ExamResult[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch results');
    }
  }
);

export const fetchExamStatistics = createAsyncThunk(
  'studentExams/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.EXAMS_STATISTICS);
      return response.data.data as ExamStatistics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchExamsByStatus = createAsyncThunk(
  'studentExams/fetchByStatus',
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.EXAMS_STATUS(status));
      return response.data.data as Exam[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exams by status');
    }
  }
);

export const fetchExamDetail = createAsyncThunk(
  'studentExams/fetchDetail',
  async (examId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.EXAMS_BY_ID(examId));
      return response.data.data as ExamDetail;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exam detail');
    }
  }
);

const studentExamsSlice = createSlice({
  name: 'studentExams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Exams
      .addCase(fetchStudentExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentExams.fulfilled, (state, action) => {
        state.loading = false;
        state.allExams = action.payload;
      })
      .addCase(fetchStudentExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Upcoming
      .addCase(fetchUpcomingExams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpcomingExams.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingExams = action.payload;
      })
      .addCase(fetchUpcomingExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Results
      .addCase(fetchExamResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchExamResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Statistics
      .addCase(fetchExamStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchExamStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by Status
      .addCase(fetchExamsByStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.allExams = {
          upcoming: action.payload.filter((e) => e.status === 'UPCOMING'),
          ongoing: action.payload.filter((e) => e.status === 'ONGOING'),
          completed: action.payload.filter((e) => e.status === 'COMPLETED'),
          summary: {
            total: action.payload.length,
            upcomingCount: action.payload.filter((e) => e.status === 'UPCOMING').length,
            ongoingCount: action.payload.filter((e) => e.status === 'ONGOING').length,
            completedCount: action.payload.filter((e) => e.status === 'COMPLETED').length,
          },
        };
      })
      .addCase(fetchExamsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Detail
      .addCase(fetchExamDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExam = action.payload;
      })
      .addCase(fetchExamDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = studentExamsSlice.actions;
export default studentExamsSlice.reducer;
