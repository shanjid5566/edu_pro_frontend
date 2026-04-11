import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { STUDENT_ENDPOINTS } from '@/constants/apiEndpoints';

// Interfaces
export interface ResultDetail {
  id: string;
  examId: string;
  examName: string;
  subject: string;
  subjectId: string;
  class: string;
  date: string;
  type: 'HALF_YEARLY' | 'QUARTERLY' | 'MONTHLY' | 'UNIT_TEST';
  status: 'COMPLETED';
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
}

export interface ResultsSummary {
  totalExams: number;
  totalMarksObtained: number;
  totalMarksCount: number;
  averagePercentage: number;
  averageGrade: string;
  highestPercentage: number;
  lowestPercentage: number;
}

export interface SubjectPerformance {
  subjectId: string;
  subject: string;
  averagePercentage: number;
  grade: string;
  totalExams: number;
  marksObtained: number;
  totalMarks: number;
}

export interface ClassComparison {
  studentPercentage: number;
  classAverage: number;
  difference: number;
  studentRank: number;
  totalStudents: number;
  percentileRank: number;
}

export interface TrendData {
  examName: string;
  date: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
}

export interface SubjectResultDetail {
  subject: string;
  averagePercentage: number;
  totalExams: number;
  averageGrade: string;
  results: ResultDetail[];
}

export interface StudentResultsState {
  allResults: ResultDetail[];
  summary: ResultsSummary | null;
  subjectPerformance: SubjectPerformance[];
  classComparison: ClassComparison | null;
  trendData: TrendData[];
  subjectDetail: SubjectResultDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentResultsState = {
  allResults: [],
  summary: null,
  subjectPerformance: [],
  classComparison: null,
  trendData: [],
  subjectDetail: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchStudentResults = createAsyncThunk('studentResults/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.RESULTS);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch results');
  }
});

export const fetchResultsSummary = createAsyncThunk('studentResults/fetchSummary', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.RESULTS_SUMMARY);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
  }
});

export const fetchSubjectPerformance = createAsyncThunk('studentResults/fetchSubjectPerformance', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.RESULTS_SUBJECT_PERFORMANCE);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch subject performance');
  }
});

export const fetchClassComparison = createAsyncThunk('studentResults/fetchClassComparison', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.RESULTS_CLASS_COMPARISON);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch class comparison');
  }
});

export const fetchResultsTrend = createAsyncThunk('studentResults/fetchTrend', async (months: number = 6, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.RESULTS_TREND(months));
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch trend data');
  }
});

export const fetchResultsBySubject = createAsyncThunk('studentResults/fetchBySubject', async (subjectId: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.RESULTS_BY_SUBJECT(subjectId));
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch subject results');
  }
});

// Slice
const studentResultsSlice = createSlice({
  name: 'studentResults',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Results
    builder
      .addCase(fetchStudentResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentResults.fulfilled, (state, action) => {
        state.loading = false;
        state.allResults = action.payload;
      })
      .addCase(fetchStudentResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Summary
    builder
      .addCase(fetchResultsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchResultsSummary.rejected, (state, action) => {
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

    // Fetch Class Comparison
    builder
      .addCase(fetchClassComparison.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassComparison.fulfilled, (state, action) => {
        state.loading = false;
        state.classComparison = action.payload;
      })
      .addCase(fetchClassComparison.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Trend Data
    builder
      .addCase(fetchResultsTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultsTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.trendData = action.payload;
      })
      .addCase(fetchResultsTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Subject Detail
    builder
      .addCase(fetchResultsBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultsBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectDetail = action.payload;
      })
      .addCase(fetchResultsBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = studentResultsSlice.actions;
export default studentResultsSlice.reducer;
