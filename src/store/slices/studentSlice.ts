import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ADMIN_ENDPOINTS } from '@/constants/apiEndpoints';

// Types
export interface StudentData {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  rollNumber: string;
  attendance: number;
  grade: string;
  status: 'active' | 'inactive';
}

export interface StudentDetail extends StudentData {
  phone: string;
  classAndSection: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  parentName: string;
  admissionDate: string;
  recentExams: Array<{
    examName: string;
    marks: number;
    grade: string;
  }>;
}

export interface Pagination {
  total: number;
  skip: number;
  take: number;
  pages: number;
}

interface StudentState {
  students: StudentData[];
  selectedStudent: StudentDetail | null;
  searchResults: StudentData[];
  classStudents: StudentData[];
  classes: Array<{ id: string; name: string; studentCount: number }>;
  pagination: Pagination;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  searchResults: [],
  classStudents: [],
  classes: [],
  pagination: { total: 0, skip: 0, take: 10, pages: 0 },
  loading: false,
  searchLoading: false,
  error: null,
};

// Async Thunks
export const fetchStudents = createAsyncThunk(
  'student/fetchStudents',
  async (
    params: { page: number; limit: number; search?: string; classId?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = {
        page: params.page,
        limit: params.limit,
        ...(params.search && { search: params.search }),
        ...(params.classId && { classId: params.classId }),
        ...(params.status && { status: params.status }),
      };

      const response = await axiosInstance.get(ADMIN_ENDPOINTS.STUDENTS, { params: queryParams });
      console.log('Students Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Students fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'student/fetchStudentById',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.STUDENT_BY_ID(studentId));
      console.log('Student Detail Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Student detail fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student');
    }
  }
);

export const searchStudents = createAsyncThunk(
  'student/searchStudents',
  async (params: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/students/search', {
        params: {
          query: params.query,
          limit: params.limit || 10,
        },
      });
      console.log('Search Results:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Search error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to search students');
    }
  }
);

export const getStudentsByClass = createAsyncThunk(
  'student/getStudentsByClass',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/admin/students/class/${classId}`);
      console.log('Class Students Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Class students fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch class students');
    }
  }
);

export const createStudent = createAsyncThunk(
  'student/createStudent',
  async (
    studentData: {
      fullName: string;
      email: string;
      password: string;
      classId: string;
      section: string;
      rollNumber: string;
      dateOfBirth: string;
      gender: string;
      phone: string;
      parentName: string;
      address: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(ADMIN_ENDPOINTS.CREATE_STUDENT, studentData);
      console.log('Create Student Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Create student error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create student');
    }
  }
);

export const updateStudent = createAsyncThunk(
  'student/updateStudent',
  async (
    params: { studentId: string; data: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        ADMIN_ENDPOINTS.UPDATE_STUDENT(params.studentId),
        params.data
      );
      console.log('Update Student Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Update student error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update student');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'student/deleteStudent',
  async (studentId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ADMIN_ENDPOINTS.DELETE_STUDENT(studentId));
      console.log('Student deleted successfully');
      return studentId;
    } catch (error: any) {
      console.error('Delete student error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete student');
    }
  }
);

export const exportStudentsCSV = createAsyncThunk(
  'student/exportStudentsCSV',
  async (
    params: { search?: string; classId?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/students/export/csv', {
        params: {
          search: params.search || '',
          classId: params.classId || '',
          status: params.status || '',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Export error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to export students');
    }
  }
);

export const getClasses = createAsyncThunk(
  'student/getClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/students/classes/list');
      console.log('Classes Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Classes fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);

// Slice
const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Students
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Student By ID
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Students
    builder
      .addCase(searchStudents.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchStudents.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchStudents.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      });

    // Get Students By Class
    builder
      .addCase(getStudentsByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentsByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classStudents = action.payload || [];
      })
      .addCase(getStudentsByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Student
    builder
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Student
    builder
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = { ...state.students[index], ...action.payload };
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = { ...state.selectedStudent, ...action.payload };
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Student
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Classes
    builder
      .addCase(getClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload || [];
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedStudent, clearSearchResults } = studentSlice.actions;
export default studentSlice.reducer;
