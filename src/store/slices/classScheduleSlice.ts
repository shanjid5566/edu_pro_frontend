import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Types
interface ScheduleData {
  id: string;
  classId: string;
  className: string;
  classSection: string;
  day: string;
  subjectName: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
}

interface ScheduleDetail {
  id: string;
  classId: string;
  className: string;
  classSection: string;
  day: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
}

interface TeacherOption {
  id: string;
  name: string;
}

interface ClassOption {
  id: string;
  label: string;
}

interface Pagination {
  total: number;
  skip: number;
  take: number;
  pages: number;
}

interface ScheduleState {
  schedules: ScheduleData[];
  selectedSchedule: ScheduleDetail | null;
  searchResults: ScheduleData[];
  classesDropdown: ClassOption[];
  teachersDropdown: TeacherOption[];
  pagination: Pagination;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  schedules: [],
  selectedSchedule: null,
  searchResults: [],
  classesDropdown: [],
  teachersDropdown: [],
  pagination: { total: 0, skip: 0, take: 10, pages: 0 },
  loading: false,
  searchLoading: false,
  error: null,
};

// Async Thunks
export const fetchSchedules = createAsyncThunk(
  'classSchedule/fetchSchedules',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const skip = (page - 1) * limit;
    const response = await axiosInstance.get(`/api/v1/admin/class-schedules`, {
      params: { page, limit, skip, take: limit },
    });
    return response.data;
  }
);

export const fetchScheduleById = createAsyncThunk(
  'classSchedule/fetchScheduleById',
  async (id: string) => {
    const response = await axiosInstance.get(`/api/v1/admin/class-schedules/${id}`);
    return response.data.data;
  }
);

export const searchSchedules = createAsyncThunk(
  'classSchedule/searchSchedules',
  async ({ q, limit = 10 }: { q: string; limit?: number }) => {
    const response = await axiosInstance.get(`/api/v1/admin/class-schedules/search`, {
      params: { q, limit },
    });
    return response.data.data || [];
  }
);

export const getSchedulesByClass = createAsyncThunk(
  'classSchedule/getSchedulesByClass',
  async (classId: string) => {
    const response = await axiosInstance.get(`/api/v1/admin/class-schedules/by-class/${classId}`);
    return response.data.data || [];
  }
);

export const getSchedulesByDay = createAsyncThunk(
  'classSchedule/getSchedulesByDay',
  async (day: string) => {
    const response = await axiosInstance.get(`/api/v1/admin/class-schedules/by-day/${day}`);
    return response.data.data || [];
  }
);

export const getClassesDropdown = createAsyncThunk(
  'classSchedule/getClassesDropdown',
  async () => {
    const response = await axiosInstance.get(`/api/v1/admin/class-schedules/dropdown/classes`);
    return response.data.data || [];
  }
);

export const getTeachersDropdown = createAsyncThunk(
  'classSchedule/getTeachersDropdown',
  async () => {
    const response = await axiosInstance.get(`/api/v1/admin/class-schedules/dropdown/teachers`);
    return response.data.data || [];
  }
);

export const createSchedule = createAsyncThunk(
  'classSchedule/createSchedule',
  async (payload: {
    classId: string;
    subjectId: string;
    day: string;
    teacherId: string;
    startTime: string;
    endTime: string;
    roomNumber: string;
  }) => {
    const response = await axiosInstance.post(`/api/v1/admin/class-schedules`, payload);
    return response.data.data;
  }
);

export const updateSchedule = createAsyncThunk(
  'classSchedule/updateSchedule',
  async ({
    id,
    ...payload
  }: {
    id: string;
    day: string;
    subjectId: string;
    teacherId: string;
    startTime: string;
    endTime: string;
    roomNumber: string;
  }) => {
    const response = await axiosInstance.put(`/api/v1/admin/class-schedules/${id}`, payload);
    return response.data.data;
  }
);

export const deleteSchedule = createAsyncThunk(
  'classSchedule/deleteSchedule',
  async (id: string) => {
    await axiosInstance.delete(`/api/v1/admin/class-schedules/${id}`);
    return id;
  }
);

export const exportSchedulesCSV = createAsyncThunk(
  'classSchedule/exportSchedulesCSV',
  async ({ search = '', classId = '', day = '' }: { search?: string; classId?: string; day?: string } = {}) => {
    const response = await axiosInstance.get(`/api/v1/admin/class-schedules/export/csv`, {
      params: { search, classId, day },
      responseType: 'blob',
    });
    return response.data;
  }
);

// Slice
const classScheduleSlice = createSlice({
  name: 'classSchedule',
  initialState,
  reducers: {
    clearSelectedSchedule: (state) => {
      state.selectedSchedule = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Schedules
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.schedules = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.loading = false;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schedules';
      });

    // Fetch Schedule by ID
    builder
      .addCase(fetchScheduleById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.selectedSchedule = action.payload;
        state.loading = false;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schedule details';
      });

    // Search Schedules
    builder
      .addCase(searchSchedules.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchSchedules.fulfilled, (state, action) => {
        state.searchResults = action.payload || [];
        state.searchLoading = false;
      })
      .addCase(searchSchedules.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Search failed';
      });

    // Get Schedules by Class
    builder.addCase(getSchedulesByClass.fulfilled, (state, action) => {
      state.schedules = action.payload;
    });

    // Get Schedules by Day
    builder.addCase(getSchedulesByDay.fulfilled, (state, action) => {
      state.schedules = action.payload;
    });

    // Get Classes Dropdown
    builder
      .addCase(getClassesDropdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClassesDropdown.fulfilled, (state, action) => {
        state.classesDropdown = action.payload;
        state.loading = false;
      })
      .addCase(getClassesDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch classes';
      });

    // Get Teachers Dropdown
    builder
      .addCase(getTeachersDropdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeachersDropdown.fulfilled, (state, action) => {
        state.teachersDropdown = action.payload;
        state.loading = false;
      })
      .addCase(getTeachersDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teachers';
      });

    // Create Schedule
    builder
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedules.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create schedule';
      });

    // Update Schedule
    builder
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update schedule';
      });

    // Delete Schedule
    builder
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter((s) => s.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete schedule';
      });

    // Export CSV
    builder
      .addCase(exportSchedulesCSV.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportSchedulesCSV.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportSchedulesCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export schedules';
      });
  },
});

export const { clearSelectedSchedule, clearSearchResults } = classScheduleSlice.actions;
export default classScheduleSlice.reducer;
