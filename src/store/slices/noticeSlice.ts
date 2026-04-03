import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Types
export type NoticeCategory = 'GENERAL' | 'EXAM' | 'EVENT' | 'HOLIDAY';
export type NoticePriority = 'normal' | 'high' | 'urgent';

export interface NoticeAuthor {
  id: string;
  name: string;
  email?: string;
}

export interface NoticeData {
  id: string;
  title: string;
  message: string;
  category: NoticeCategory;
  priority: NoticePriority;
  pinned: boolean;
  createdBy: string;
  createdAt: string;
  author: NoticeAuthor;
}

export interface NoticeStatistics {
  total: number;
  pinnedCount: number;
  byCategory: Array<{
    category: string;
    count: number;
  }>;
}

export interface NoticeState {
  notices: NoticeData[];
  selectedNotice: NoticeData | null;
  pinnedNotices: NoticeData[];
  recentNotices: NoticeData[];
  searchResults: NoticeData[];
  statistics: NoticeStatistics | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
}

const initialState: NoticeState = {
  notices: [],
  selectedNotice: null,
  pinnedNotices: [],
  recentNotices: [],
  searchResults: [],
  statistics: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  loading: false,
  searchLoading: false,
  error: null,
};

// Async Thunks
export const fetchNotices = createAsyncThunk(
  'notice/fetchNotices',
  async ({ page = 1, limit = 10, category = 'all', search = '' }: { page?: number; limit?: number; category?: string; search?: string } = {}) => {
    const response = await axiosInstance.get('/api/v1/admin/notices', {
      params: { page, limit, category, search },
    });
    return response.data;
  }
);

export const fetchNoticeById = createAsyncThunk(
  'notice/fetchNoticeById',
  async (id: string) => {
    const response = await axiosInstance.get(`/api/v1/admin/notices/${id}`);
    return response.data.data;
  }
);

export const getNoticesByCategory = createAsyncThunk(
  'notice/getByCategory',
  async (category: string) => {
    const response = await axiosInstance.get(`/api/v1/admin/notices/category/${category}`);
    return response.data.data;
  }
);

export const getPinnedNotices = createAsyncThunk(
  'notice/getPinned',
  async () => {
    const response = await axiosInstance.get('/api/v1/admin/notices/pinned');
    return response.data.data;
  }
);

export const getRecentNotices = createAsyncThunk(
  'notice/getRecent',
  async (limit: number = 5) => {
    const response = await axiosInstance.get('/api/v1/admin/notices/recent', {
      params: { limit },
    });
    return response.data.data;
  }
);

export const searchNotices = createAsyncThunk(
  'notice/search',
  async (query: string) => {
    const response = await axiosInstance.get('/api/v1/admin/notices/search', {
      params: { query },
    });
    return response.data.data;
  }
);

export const getNoticeStatistics = createAsyncThunk(
  'notice/getStatistics',
  async () => {
    const response = await axiosInstance.get('/api/v1/admin/notices/statistics');
    return response.data.data;
  }
);

export const createNotice = createAsyncThunk(
  'notice/create',
  async (data: {
    title: string;
    message: string;
    category: NoticeCategory;
    priority: NoticePriority;
    pinned: boolean;
  }) => {
    const response = await axiosInstance.post('/api/v1/admin/notices', data);
    return response.data.data;
  }
);

export const updateNotice = createAsyncThunk(
  'notice/update',
  async ({ id, data }: {
    id: string;
    data: {
      title: string;
      message: string;
      category: NoticeCategory;
      priority: NoticePriority;
      pinned: boolean;
    };
  }) => {
    const response = await axiosInstance.put(`/api/v1/admin/notices/${id}`, data);
    return response.data.data;
  }
);

export const pinNotice = createAsyncThunk(
  'notice/pin',
  async (id: string) => {
    const response = await axiosInstance.put(`/api/v1/admin/notices/${id}/pin`);
    return response.data.data;
  }
);

export const deleteNotice = createAsyncThunk(
  'notice/delete',
  async (id: string) => {
    await axiosInstance.delete(`/api/v1/admin/notices/${id}`);
    return id;
  }
);

// Slice
const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    clearNotices: (state) => {
      state.notices = [];
      state.selectedNotice = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notices
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload.data;
        state.pagination = {
          total: action.payload.pagination.total || 0,
          page: action.payload.pagination.page || 1,
          limit: action.payload.pagination.limit || 10,
          pages: action.payload.pagination.pages || 0,
        };
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notices';
      });

    // Fetch Notice By ID
    builder
      .addCase(fetchNoticeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoticeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNotice = action.payload;
      })
      .addCase(fetchNoticeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notice';
      });

    // Get By Category
    builder
      .addCase(getNoticesByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNoticesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(getNoticesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notices by category';
      });

    // Get Pinned
    builder
      .addCase(getPinnedNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPinnedNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.pinnedNotices = action.payload;
      })
      .addCase(getPinnedNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pinned notices';
      });

    // Get Recent
    builder
      .addCase(getRecentNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecentNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.recentNotices = action.payload;
      })
      .addCase(getRecentNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recent notices';
      });

    // Search
    builder
      .addCase(searchNotices.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchNotices.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchNotices.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Failed to search notices';
      });

    // Get Statistics
    builder
      .addCase(getNoticeStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNoticeStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getNoticeStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch statistics';
      });

    // Create Notice
    builder
      .addCase(createNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.notices.unshift(action.payload);
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create notice';
      });

    // Update Notice
    builder
      .addCase(updateNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notices.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.notices[index] = action.payload;
        }
        if (state.selectedNotice?.id === action.payload.id) {
          state.selectedNotice = action.payload;
        }
      })
      .addCase(updateNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update notice';
      });

    // Pin Notice
    builder
      .addCase(pinNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pinNotice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notices.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.notices[index] = action.payload;
        }
        if (state.selectedNotice?.id === action.payload.id) {
          state.selectedNotice = action.payload;
        }
      })
      .addCase(pinNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to pin notice';
      });

    // Delete Notice
    builder
      .addCase(deleteNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = state.notices.filter((n) => n.id !== action.payload);
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete notice';
      });
  },
});

export const { clearNotices, clearError } = noticeSlice.actions;
export default noticeSlice.reducer;
