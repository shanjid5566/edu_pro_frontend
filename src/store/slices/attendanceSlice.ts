import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Types
export interface AttendanceStatistics {
  present: number;
  absent: number;
  late: number;
  total: number;
  presentPercentage?: number;
  absentPercentage?: number;
  latePercentage?: number;
}

export interface ClasswiseAttendance {
  classId: string;
  className: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  rate: number;
}

export interface AttendanceOverview {
  statistics: AttendanceStatistics;
  classwise: ClasswiseAttendance[];
}

export interface StudentData {
  id: string;
  user: {
    name: string;
    email?: string;
  };
}

export interface ClassData {
  id: string;
  name: string;
  section: string;
}

export interface TeacherData {
  id: string;
  user: {
    name: string;
  };
}

export interface AttendanceData {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  student: StudentData;
  class: ClassData;
  teacher?: TeacherData;
}

export interface AttendanceRecord extends AttendanceData {
  studentName?: string;
  className?: string;
}

export interface StudentAttendanceHistory {
  attendance: AttendanceData[];
  statistics: AttendanceStatistics;
}

export interface AttendanceState {
  attendance: AttendanceData[];
  selectedAttendance: AttendanceData | null;
  statistics: AttendanceStatistics;
  overview: AttendanceOverview | null;
  classwise: ClasswiseAttendance[];
  studentHistory: StudentAttendanceHistory | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  attendance: [],
  selectedAttendance: null,
  statistics: {
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
    presentPercentage: 0,
    absentPercentage: 0,
    latePercentage: 0,
  },
  overview: null,
  classwise: [],
  studentHistory: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async ({ page = 1, limit = 10, classId = '', status = '' }: { page?: number; limit?: number; classId?: string; status?: string } = {}) => {
    const skip = (page - 1) * limit;
    const response = await axiosInstance.get('/api/v1/admin/attendance', {
      params: { page, limit, skip, take: limit, classId, status },
    });
    return response.data;
  }
);

export const fetchAttendanceById = createAsyncThunk(
  'attendance/fetchAttendanceById',
  async (id: string) => {
    const response = await axiosInstance.get(`/api/v1/admin/attendance/${id}`);
    return response.data.data;
  }
);

export const getAttendanceStatistics = createAsyncThunk(
  'attendance/getStatistics',
  async () => {
    const response = await axiosInstance.get('/api/v1/admin/attendance/statistics/today');
    return response.data.data;
  }
);

export const getAttendanceOverview = createAsyncThunk(
  'attendance/getOverview',
  async () => {
    const response = await axiosInstance.get('/api/v1/admin/attendance/overview/today');
    return response.data.data;
  }
);

export const getClasswiseAttendance = createAsyncThunk(
  'attendance/getClasswise',
  async (date?: string) => {
    const params = date ? { date } : undefined;
    const response = await axiosInstance.get('/api/v1/admin/attendance/classwise', { params });
    return response.data.data;
  }
);

export const getAttendanceByDateRange = createAsyncThunk(
  'attendance/getByDateRange',
  async ({ startDate, endDate, classId = '' }: { startDate: string; endDate: string; classId?: string }) => {
    const response = await axiosInstance.get('/api/v1/admin/attendance/range', {
      params: { startDate, endDate, classId },
    });
    return response.data.data;
  }
);

export const getStudentAttendanceHistory = createAsyncThunk(
  'attendance/getStudentHistory',
  async ({ studentId, limit = 30 }: { studentId: string; limit?: number }) => {
    const response = await axiosInstance.get(`/api/v1/admin/attendance/student/${studentId}`, {
      params: { limit },
    });
    return response.data.data;
  }
);

export const getClassAttendanceReport = createAsyncThunk(
  'attendance/getClassReport',
  async ({ classId, startDate, endDate }: { classId: string; startDate: string; endDate: string }) => {
    const response = await axiosInstance.get(`/api/v1/admin/attendance/report/class/${classId}`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async ({ classId, date, attendanceData }: { classId: string; date: string; attendanceData: Array<{ studentId: string; status: string }> }) => {
    const response = await axiosInstance.post('/api/v1/admin/attendance/mark', {
      classId,
      date,
      attendanceData,
    });
    return response.data.data;
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await axiosInstance.put(`/api/v1/admin/attendance/${id}`, {
      status,
    });
    return response.data.data;
  }
);

export const deleteAttendance = createAsyncThunk(
  'attendance/delete',
  async (id: string) => {
    await axiosInstance.delete(`/api/v1/admin/attendance/${id}`);
    return id;
  }
);

export const exportAttendanceCSV = createAsyncThunk(
  'attendance/exportCSV',
  async ({ startDate, endDate, classId = '' }: { startDate: string; endDate: string; classId?: string }) => {
    const response = await axiosInstance.get('/api/v1/admin/attendance/export/csv', {
      params: { startDate, endDate, classId },
      responseType: 'blob',
    });
    return response.data;
  }
);

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendance: (state) => {
      state.attendance = [];
      state.selectedAttendance = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Attendance
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.data;
        state.pagination = {
          total: action.payload.pagination.total,
          page: action.payload.pagination.page || 1,
          limit: action.payload.pagination.limit || 10,
          pages: action.payload.pagination.pages || 0,
        };
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch attendance';
      });

    // Fetch Attendance By ID
    builder
      .addCase(fetchAttendanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAttendance = action.payload;
      })
      .addCase(fetchAttendanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch attendance';
      });

    // Get Statistics
    builder
      .addCase(getAttendanceStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAttendanceStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getAttendanceStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch statistics';
      });

    // Get Overview
    builder
      .addCase(getAttendanceOverview.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAttendanceOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
        state.statistics = action.payload.statistics;
        state.classwise = action.payload.classwise;
      })
      .addCase(getAttendanceOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch overview';
      });

    // Get Classwise
    builder
      .addCase(getClasswiseAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClasswiseAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.classwise = action.payload;
      })
      .addCase(getClasswiseAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch classwise attendance';
      });

    // Get By Date Range
    builder
      .addCase(getAttendanceByDateRange.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAttendanceByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(getAttendanceByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch attendance';
      });

    // Get Student History
    builder
      .addCase(getStudentAttendanceHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.studentHistory = action.payload;
      })
      .addCase(getStudentAttendanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch student history';
      });

    // Get Class Report
    builder
      .addCase(getClassAttendanceReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClassAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(getClassAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch report';
      });

    // Mark Attendance
    builder
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to mark attendance';
      });

    // Update Attendance
    builder
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendance.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.attendance[index] = action.payload;
        }
        if (state.selectedAttendance?.id === action.payload.id) {
          state.selectedAttendance = action.payload;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update attendance';
      });

    // Delete Attendance
    builder
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = state.attendance.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete attendance';
      });

    // Export CSV
    builder
      .addCase(exportAttendanceCSV.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportAttendanceCSV.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportAttendanceCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export attendance';
      });
  },
});

export const { clearAttendance, clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
