import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { STUDENT_ENDPOINTS } from '@/constants/apiEndpoints';

// Interfaces
export interface Fee {
  id: string;
  type: string;
  period: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidDate?: string;
  receiptNo?: string;
  paidAmount?: number;
}

export interface FeesSummary {
  totalPaid: number;
  totalUnpaid: number;
  totalPartial: number;
  totalRecords: number;
  totalPayable: number;
  pendingAmount: number;
}

export interface FeeByType {
  type: string;
  count: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
}

export interface FeeTimeline {
  id: string;
  type: string;
  amount: number;
  paidAmount?: number;
  paidDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
}

export interface OverdueData {
  totalPaid: number;
  count: number;
  fees: Fee[];
}

export interface StudentFeesState {
  allFees: Fee[];
  summary: FeesSummary | null;
  byType: FeeByType[];
  timeline: FeeTimeline[];
  upcoming: Fee[];
  overdue: OverdueData | null;
  filtered: Fee[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentFeesState = {
  allFees: [],
  summary: null,
  byType: [],
  timeline: [],
  upcoming: [],
  overdue: null,
  filtered: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchStudentFees = createAsyncThunk('studentFees/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.FEES);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch fees');
  }
});

export const fetchFeesSummary = createAsyncThunk('studentFees/fetchSummary', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.FEES_SUMMARY);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
  }
});

export const fetchFeesByType = createAsyncThunk('studentFees/fetchByType', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.FEES_BY_TYPE);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch fees by type');
  }
});

export const fetchFeesTimeline = createAsyncThunk(
  'studentFees/fetchTimeline',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.FEES_TIMELINE(limit));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timeline');
    }
  },
);

export const fetchUpcomingFees = createAsyncThunk('studentFees/fetchUpcoming', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.FEES_UPCOMING);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming fees');
  }
});

export const fetchOverdueFees = createAsyncThunk('studentFees/fetchOverdue', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(STUDENT_ENDPOINTS.FEES_OVERDUE);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch overdue fees');
  }
});

export const fetchFeesByStatus = createAsyncThunk(
  'studentFees/fetchByStatus',
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.FEES_STATUS(status));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fees by status');
    }
  },
);

// Slice
const studentFeesSlice = createSlice({
  name: 'studentFees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    filterFeesByStatus: (state, action) => {
      const status = action.payload as string;
      if (status === 'all') {
        state.filtered = state.allFees;
      } else {
        state.filtered = state.allFees.filter((fee) => fee.status === status);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch All Fees
    builder
      .addCase(fetchStudentFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFees.fulfilled, (state, action) => {
        state.loading = false;
        state.allFees = action.payload;
        state.filtered = action.payload;
      })
      .addCase(fetchStudentFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Summary
    builder
      .addCase(fetchFeesSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchFeesSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch By Type
    builder
      .addCase(fetchFeesByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesByType.fulfilled, (state, action) => {
        state.loading = false;
        state.byType = action.payload;
      })
      .addCase(fetchFeesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Timeline
    builder
      .addCase(fetchFeesTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.timeline = action.payload;
      })
      .addCase(fetchFeesTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Upcoming
    builder
      .addCase(fetchUpcomingFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingFees.fulfilled, (state, action) => {
        state.loading = false;
        state.upcoming = action.payload;
      })
      .addCase(fetchUpcomingFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Overdue
    builder
      .addCase(fetchOverdueFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverdueFees.fulfilled, (state, action) => {
        state.loading = false;
        state.overdue = action.payload;
      })
      .addCase(fetchOverdueFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch By Status
    builder
      .addCase(fetchFeesByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.filtered = action.payload;
      })
      .addCase(fetchFeesByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, filterFeesByStatus } = studentFeesSlice.actions;
export default studentFeesSlice.reducer;
