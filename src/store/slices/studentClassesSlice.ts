import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { STUDENT_ENDPOINTS } from '@/constants/apiEndpoints';

export interface Teacher {
  id: string;
  name: string;
  email?: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  section: string;
}

export interface ScheduleClass {
  scheduleId: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  startTime?: string;
  endTime?: string;
}

export interface DailySchedule {
  day: string;
  classes: ScheduleClass[];
  totalClasses: number;
}

export interface Timetable {
  [day: string]: ScheduleClass[];
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface SubjectDetail {
  id: string;
  name: string;
  teachers: Teacher[];
  upcomingExams: Exam[];
  ongoingExams: Exam[];
  completedExams: Exam[];
}

export interface StudentClassesData {
  class: ClassInfo;
  subjects: Subject[];
  totalSubjects: number;
  teachers: Teacher[];
}

interface StudentClassesState {
  classInfo: StudentClassesData | null;
  todaySchedule: DailySchedule | null;
  timetable: Timetable | null;
  selectedDaySchedule: DailySchedule | null;
  selectedSubjectDetail: SubjectDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentClassesState = {
  classInfo: null,
  todaySchedule: null,
  timetable: null,
  selectedDaySchedule: null,
  selectedSubjectDetail: null,
  loading: false,
  error: null,
};

export const fetchStudentClasses = createAsyncThunk(
  'studentClasses/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.CLASSES);
      return response.data.data as StudentClassesData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);

export const fetchTodaySchedule = createAsyncThunk(
  'studentClasses/fetchTodaySchedule',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.CLASSES_SCHEDULE_TODAY);
      return response.data.data as DailySchedule;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today schedule');
    }
  }
);

export const fetchDaySchedule = createAsyncThunk(
  'studentClasses/fetchDaySchedule',
  async (day: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.CLASSES_SCHEDULE, {
        params: { day },
      });
      return (response.data.data as DailySchedule[])[0];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch day schedule');
    }
  }
);

export const fetchTimetable = createAsyncThunk(
  'studentClasses/fetchTimetable',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.CLASSES_TIMETABLE);
      return response.data.data as Timetable;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable');
    }
  }
);

export const fetchSubjectDetail = createAsyncThunk(
  'studentClasses/fetchSubjectDetail',
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(STUDENT_ENDPOINTS.CLASSES_SUBJECT(subjectId));
      return response.data.data as SubjectDetail;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subject detail');
    }
  }
);

const studentClassesSlice = createSlice({
  name: 'studentClasses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchStudentClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classInfo = action.payload;
      })
      .addCase(fetchStudentClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Today Schedule
      .addCase(fetchTodaySchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodaySchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.todaySchedule = action.payload;
      })
      .addCase(fetchTodaySchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Day Schedule
      .addCase(fetchDaySchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDaySchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDaySchedule = action.payload;
      })
      .addCase(fetchDaySchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Timetable
      .addCase(fetchTimetable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload;
      })
      .addCase(fetchTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Subject Detail
      .addCase(fetchSubjectDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjectDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubjectDetail = action.payload;
      })
      .addCase(fetchSubjectDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = studentClassesSlice.actions;
export default studentClassesSlice.reducer;
