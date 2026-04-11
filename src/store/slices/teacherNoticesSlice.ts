import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { TEACHER_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Notice {
  id: string;
  title: string;
  message: string;
  category: 'GENERAL' | 'EXAM' | 'EVENT' | 'HOLIDAY';
  priority: 'low' | 'normal' | 'high';
  pinned: boolean;
  date: string;
  author: string;
  authorEmail?: string;
}

export interface NoticesResponse {
  notices: Notice[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NoticeStatistics {
  total: number;
  pinned: number;
  byCategory: {
    general: number;
    exam: number;
    event: number;
    holiday: number;
  };
}

interface TeacherNoticesState {
  allNotices: Notice[];
  pinnedNotices: Notice[];
  recentNotices: Notice[];
  selectedNotice: Notice | null;
  statistics: NoticeStatistics | null;
  currentPage: number;
  totalPages: number;
  totalNotices: number;
  loading: boolean;
  detailLoading: boolean;
  searchLoading: boolean;
  error: string | null;
}

const initialState: TeacherNoticesState = {
  allNotices: [],
  pinnedNotices: [],
  recentNotices: [],
  selectedNotice: null,
  statistics: null,
  currentPage: 1,
  totalPages: 1,
  totalNotices: 0,
  loading: false,
  detailLoading: false,
  searchLoading: false,
  error: null,
};

export const fetchTeacherNotices = createAsyncThunk(
  'teacherNotices/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.NOTICES, {
        params: { page, limit },
      });
      return response.data.data as {
        data: Notice[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notices');
    }
  }
);

export const fetchPinnedNotices = createAsyncThunk(
  'teacherNotices/fetchPinned',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.NOTICES_PINNED);
      return response.data.data as Notice[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pinned notices');
    }
  }
);

export const fetchRecentNotices = createAsyncThunk(
  'teacherNotices/fetchRecent',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.NOTICES_RECENT, {
        params: { limit },
      });
      return response.data.data as Notice[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent notices');
    }
  }
);

export const fetchNoticesByCategory = createAsyncThunk(
  'teacherNotices/fetchByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.NOTICES_CATEGORY(category));
      return response.data.data as Notice[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notices by category');
    }
  }
);

export const searchNotices = createAsyncThunk(
  'teacherNotices/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.NOTICES_SEARCH, {
        params: { query },
      });
      return response.data.data as Notice[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search notices');
    }
  }
);

export const fetchNoticeStatistics = createAsyncThunk(
  'teacherNotices/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.NOTICES_STATISTICS);
      return response.data.data as NoticeStatistics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchNoticeDetail = createAsyncThunk(
  'teacherNotices/fetchDetail',
  async (noticeId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.NOTICES_BY_ID(noticeId));
      return response.data.data as Notice;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notice detail');
    }
  }
);

const teacherNoticesSlice = createSlice({
  name: 'teacherNotices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedNotice: (state) => {
      state.selectedNotice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Notices
      .addCase(fetchTeacherNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.allNotices = action.payload.data;
        state.currentPage = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalNotices = action.payload.pagination.total;
      })
      .addCase(fetchTeacherNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Pinned Notices
      .addCase(fetchPinnedNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPinnedNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.pinnedNotices = action.payload;
      })
      .addCase(fetchPinnedNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Recent Notices
      .addCase(fetchRecentNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.recentNotices = action.payload;
      })
      .addCase(fetchRecentNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch by Category
      .addCase(fetchNoticesByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNoticesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.allNotices = action.payload;
      })
      .addCase(fetchNoticesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search
      .addCase(searchNotices.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchNotices.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.allNotices = action.payload;
      })
      .addCase(searchNotices.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      })
      // Statistics
      .addCase(fetchNoticeStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNoticeStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchNoticeStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Detail
      .addCase(fetchNoticeDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchNoticeDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedNotice = action.payload;
      })
      .addCase(fetchNoticeDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedNotice } = teacherNoticesSlice.actions;
export default teacherNoticesSlice.reducer;
