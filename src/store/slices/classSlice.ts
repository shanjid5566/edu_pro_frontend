import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Types
interface Teacher {
  id: string;
  name: string;
  email?: string;
  department?: string;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  section: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface ClassData {
  id: string;
  name: string;
  section: string;
  capacity: number;
  studentCount: number;
  capacityPercentage: number;
  subjectCount?: number;
  classTeacher: string | Teacher;
}

interface ClassDetail extends ClassData {
  students: Student[];
  subjects: Subject[];
  teachers: Teacher[];
}

interface Pagination {
  total: number;
  skip: number;
  take: number;
  pages: number;
}

interface ClassState {
  classes: ClassData[];
  selectedClass: ClassDetail | null;
  searchResults: ClassData[];
  teachers: Teacher[];
  pagination: Pagination;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  selectedClass: null,
  searchResults: [],
  teachers: [],
  pagination: { total: 0, skip: 0, take: 10, pages: 0 },
  loading: false,
  searchLoading: false,
  error: null,
};

// Async Thunks
export const fetchClasses = createAsyncThunk(
  'class/fetchClasses',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const skip = (page - 1) * limit;
    const response = await axiosInstance.get(`/api/v1/admin/classes`, {
      params: { page, limit, skip, take: limit },
    });
    return response.data;
  }
);

export const fetchClassById = createAsyncThunk('class/fetchClassById', async (id: string) => {
  const response = await axiosInstance.get(`/api/v1/admin/classes/${id}`);
  return response.data.data;
});

export const searchClasses = createAsyncThunk(
  'class/searchClasses',
  async ({ q, limit = 10 }: { q: string; limit?: number }) => {
    const response = await axiosInstance.get(`/api/v1/admin/classes/search`, {
      params: { q, limit },
    });
    return response.data.data || [];
  }
);

export const createClass = createAsyncThunk(
  'class/createClass',
  async (payload: { name: string; section: string; capacity: number; classTeacherId: string }) => {
    const response = await axiosInstance.post(`/api/v1/admin/classes`, payload);
    return response.data.data;
  }
);

export const updateClass = createAsyncThunk(
  'class/updateClass',
  async ({ id, ...payload }: { id: string; name: string; section: string; capacity: number; classTeacherId: string }) => {
    const response = await axiosInstance.put(`/api/v1/admin/classes/${id}`, payload);
    return response.data.data;
  }
);

export const deleteClass = createAsyncThunk('class/deleteClass', async (id: string) => {
  await axiosInstance.delete(`/api/v1/admin/classes/${id}`);
  return id;
});

export const getTeachers = createAsyncThunk('class/getTeachers', async () => {
  const response = await axiosInstance.get(`/api/v1/admin/teachers`, {
    params: { page: 1, limit: 100 },
  });
  return response.data.data || [];
});

export const exportClassesCSV = createAsyncThunk(
  'class/exportClassesCSV',
  async ({ search = '', section = '' }: { search?: string; section?: string } = {}) => {
    const response = await axiosInstance.get(`/api/v1/admin/classes/export/csv`, {
      params: { search, section },
      responseType: 'blob',
    });
    return response.data;
  }
);

// Slice
const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    clearSelectedClass: (state) => {
      state.selectedClass = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Classes
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.classes = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.loading = false;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch classes';
      });

    // Fetch Class by ID
    builder
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.selectedClass = action.payload;
        state.loading = false;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch class details';
      });

    // Search Classes
    builder
      .addCase(searchClasses.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchClasses.fulfilled, (state, action) => {
        state.searchResults = action.payload || [];
        state.searchLoading = false;
      })
      .addCase(searchClasses.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Search failed';
      });

    // Create Class
    builder
      .addCase(createClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.classes.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create class';
      });

    // Update Class
    builder
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        const index = state.classes.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update class';
      });

    // Delete Class
    builder
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter((c) => c.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete class';
      });

    // Get Teachers
    builder
      .addCase(getTeachers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeachers.fulfilled, (state, action) => {
        state.teachers = action.payload;
        state.loading = false;
      })
      .addCase(getTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teachers';
      });

    // Export CSV
    builder
      .addCase(exportClassesCSV.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportClassesCSV.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportClassesCSV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export classes';
      });
  },
});

export const { clearSelectedClass, clearSearchResults } = classSlice.actions;
export default classSlice.reducer;
