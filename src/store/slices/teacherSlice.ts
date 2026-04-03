import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ADMIN_ENDPOINTS } from '@/constants/apiEndpoints';

// Types
export interface TeacherData {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  classesTaken: number;
  subjects: string | string[];
  classesAssigned: number;
  status: 'active' | 'inactive';
}

export interface TeacherDetail extends TeacherData {
  classesAssigned: string[];
  classTeacherOf: string[];
}

export interface Pagination {
  total: number;
  skip: number;
  take: number;
  pages: number;
}

interface TeacherState {
  teachers: TeacherData[];
  selectedTeacher: TeacherDetail | null;
  searchResults: TeacherData[];
  departmentTeachers: TeacherData[];
  departments: string[];
  pagination: Pagination;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  selectedTeacher: null,
  searchResults: [],
  departmentTeachers: [],
  departments: [],
  pagination: { total: 0, skip: 0, take: 10, pages: 0 },
  loading: false,
  searchLoading: false,
  error: null,
};

// Async Thunks
export const fetchTeachers = createAsyncThunk(
  'teacher/fetchTeachers',
  async (
    params: { page: number; limit: number; search?: string; department?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = {
        page: params.page,
        limit: params.limit,
        ...(params.search && { search: params.search }),
        ...(params.department && { department: params.department }),
        ...(params.status && { status: params.status }),
      };

      const response = await axiosInstance.get(ADMIN_ENDPOINTS.TEACHERS, { params: queryParams });
      console.log('Teachers Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Teachers fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teachers');
    }
  }
);

export const fetchTeacherById = createAsyncThunk(
  'teacher/fetchTeacherById',
  async (teacherId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.TEACHER_BY_ID(teacherId));
      console.log('Teacher Detail Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Teacher detail fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher');
    }
  }
);

export const searchTeachers = createAsyncThunk(
  'teacher/searchTeachers',
  async (params: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/teachers/search', {
        params: {
          query: params.query,
          limit: params.limit || 10,
        },
      });
      console.log('Search Results:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Search error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to search teachers');
    }
  }
);

export const getTeachersByDepartment = createAsyncThunk(
  'teacher/getTeachersByDepartment',
  async (department: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/admin/teachers/department/${department}`);
      console.log('Department Teachers Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Department teachers fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department teachers');
    }
  }
);

export const createTeacher = createAsyncThunk(
  'teacher/createTeacher',
  async (
    teacherData: {
      fullName: string;
      email: string;
      password: string;
      phone: string;
      department: string;
      subjects: string[];
      assignClasses: string[];
      joinDate: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(ADMIN_ENDPOINTS.CREATE_TEACHER, teacherData);
      console.log('Create Teacher Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Create teacher error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create teacher');
    }
  }
);

export const updateTeacher = createAsyncThunk(
  'teacher/updateTeacher',
  async (
    params: { teacherId: string; data: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        ADMIN_ENDPOINTS.UPDATE_TEACHER(params.teacherId),
        params.data
      );
      console.log('Update Teacher Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Update teacher error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update teacher');
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  'teacher/deleteTeacher',
  async (teacherId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ADMIN_ENDPOINTS.DELETE_TEACHER(teacherId));
      console.log('Teacher deleted successfully');
      return teacherId;
    } catch (error: any) {
      console.error('Delete teacher error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete teacher');
    }
  }
);

export const getDepartments = createAsyncThunk(
  'teacher/getDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/teachers/departments/list');
      console.log('Departments Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Departments fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const exportTeachersCSV = createAsyncThunk(
  'teacher/exportTeachersCSV',
  async (
    params: { search?: string; department?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/teachers/export/csv', {
        params: {
          search: params.search || '',
          department: params.department || '',
          status: params.status || '',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Export error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to export teachers');
    }
  }
);

// Slice
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    clearSelectedTeacher: (state) => {
      state.selectedTeacher = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Teachers
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Teacher By ID
    builder
      .addCase(fetchTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeacher = action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Teachers
    builder
      .addCase(searchTeachers.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchTeachers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchTeachers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      });

    // Get Teachers By Department
    builder
      .addCase(getTeachersByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeachersByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentTeachers = action.payload || [];
      })
      .addCase(getTeachersByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Teacher
    builder
      .addCase(createTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers.push(action.payload);
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Teacher
    builder
      .addCase(updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teachers.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.teachers[index] = { ...state.teachers[index], ...action.payload };
        }
        if (state.selectedTeacher?.id === action.payload.id) {
          state.selectedTeacher = { ...state.selectedTeacher, ...action.payload };
        }
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Teacher
    builder
      .addCase(deleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = state.teachers.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Departments
    builder
      .addCase(getDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload || [];
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedTeacher, clearSearchResults } = teacherSlice.actions;
export default teacherSlice.reducer;
