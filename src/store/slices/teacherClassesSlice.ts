import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { TEACHER_ENDPOINTS } from '@/constants/apiEndpoints';

export interface TeacherAssignedClass {
  classId: string;
  className: string;
  studentCount: number;
}

export interface TeacherTodaySchedule {
  scheduleId?: string;
  classId: string;
  className: string;
  subject: string;
  time: string;
  room: string;
  studentCount: number;
}

export interface TeacherClassStudent {
  id: string;
  user: {
    name: string;
    email: string;
  };
}

export interface TeacherClassSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: {
    name: string;
  };
  roomNumber: string;
  teacher: {
    id: string;
  };
}

export interface TeacherClassDetail {
  id: string;
  name: string;
  section: string;
  capacity: number;
  students: TeacherClassStudent[];
  teachers: Array<{
    teacher: {
      id: string;
      user: {
        name: string;
      };
    };
  }>;
  schedules: TeacherClassSchedule[];
}

export interface TeacherClassStatistics {
  class: {
    id: string;
    name: string;
    section: string;
  };
  students: {
    total: number;
  };
  attendance: {
    percentage: number;
    present: number;
    absent: number;
    total: number;
  };
  performance: {
    averagePercentage: number;
    examsCount: number;
  };
}

interface TeacherClassesState {
  assignedClasses: TeacherAssignedClass[];
  todaySchedule: TeacherTodaySchedule[];
  totalClasses: number;
  selectedClass: TeacherClassDetail | null;
  selectedClassStatistics: TeacherClassStatistics | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: TeacherClassesState = {
  assignedClasses: [],
  todaySchedule: [],
  totalClasses: 0,
  selectedClass: null,
  selectedClassStatistics: null,
  loading: false,
  detailLoading: false,
  error: null,
};

export const fetchTeacherClasses = createAsyncThunk(
  'teacherClasses/fetchTeacherClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.CLASSES);
      return response.data.data as {
        today: TeacherTodaySchedule[];
        total: number;
        allClasses: TeacherAssignedClass[];
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher classes');
    }
  }
);

export const fetchTeacherTodaySchedule = createAsyncThunk(
  'teacherClasses/fetchTeacherTodaySchedule',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.CLASSES_SCHEDULE_TODAY);
      return response.data.data as TeacherTodaySchedule[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today schedule');
    }
  }
);

export const fetchTeacherClassById = createAsyncThunk(
  'teacherClasses/fetchTeacherClassById',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.CLASS_BY_ID(classId));
      return response.data.data as TeacherClassDetail;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class details');
    }
  }
);

export const fetchTeacherClassStatistics = createAsyncThunk(
  'teacherClasses/fetchTeacherClassStatistics',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TEACHER_ENDPOINTS.CLASS_STATISTICS(classId));
      return response.data.data as TeacherClassStatistics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class statistics');
    }
  }
);

const teacherClassesSlice = createSlice({
  name: 'teacherClasses',
  initialState,
  reducers: {
    clearSelectedClass: (state) => {
      state.selectedClass = null;
      state.selectedClassStatistics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedClasses = action.payload.allClasses || [];
        state.todaySchedule = action.payload.today || [];
        state.totalClasses = action.payload.total || 0;
      })
      .addCase(fetchTeacherClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeacherTodaySchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherTodaySchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.todaySchedule = action.payload || [];
      })
      .addCase(fetchTeacherTodaySchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeacherClassById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherClassById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedClass = action.payload;
      })
      .addCase(fetchTeacherClassById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeacherClassStatistics.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherClassStatistics.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedClassStatistics = action.payload;
      })
      .addCase(fetchTeacherClassStatistics.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedClass } = teacherClassesSlice.actions;
export default teacherClassesSlice.reducer;
