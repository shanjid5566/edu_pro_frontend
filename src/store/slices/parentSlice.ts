import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ADMIN_ENDPOINTS } from '@/constants/apiEndpoints';

// Types
export interface ParentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  childrenCount: number;
  children: string;
  status: 'active' | 'inactive';
}

export interface ParentDetail extends ParentData {
  children: string[];
}

export interface Pagination {
  total: number;
  skip: number;
  take: number;
  pages: number;
}

interface ParentState {
  parents: ParentData[];
  selectedParent: ParentDetail | null;
  searchResults: ParentData[];
  occupations: string[];
  pagination: Pagination;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
}

const initialState: ParentState = {
  parents: [],
  selectedParent: null,
  searchResults: [],
  occupations: [],
  pagination: { total: 0, skip: 0, take: 10, pages: 0 },
  loading: false,
  searchLoading: false,
  error: null,
};

// Async Thunks
export const fetchParents = createAsyncThunk(
  'parent/fetchParents',
  async (
    params: { page: number; limit: number; search?: string; occupation?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = {
        page: params.page,
        limit: params.limit,
        ...(params.search && { search: params.search }),
        ...(params.occupation && { occupation: params.occupation }),
        ...(params.status && { status: params.status }),
      };

      const response = await axiosInstance.get(ADMIN_ENDPOINTS.PARENTS, { params: queryParams });
      console.log('Parents Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Parents fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parents');
    }
  }
);

export const fetchParentById = createAsyncThunk(
  'parent/fetchParentById',
  async (parentId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ADMIN_ENDPOINTS.PARENT_BY_ID(parentId));
      console.log('Parent Detail Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Parent detail fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parent');
    }
  }
);

export const searchParents = createAsyncThunk(
  'parent/searchParents',
  async (params: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/parents/search', {
        params: {
          query: params.query,
          limit: params.limit || 10,
        },
      });
      console.log('Search Results:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Search error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to search parents');
    }
  }
);

export const createParent = createAsyncThunk(
  'parent/createParent',
  async (
    parentData: {
      fullName: string;
      email: string;
      password: string;
      phone: string;
      occupation: string;
      studentIds: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(ADMIN_ENDPOINTS.CREATE_PARENT, parentData);
      console.log('Create Parent Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Create parent error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create parent');
    }
  }
);

export const updateParent = createAsyncThunk(
  'parent/updateParent',
  async (
    params: { parentId: string; data: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        ADMIN_ENDPOINTS.UPDATE_PARENT(params.parentId),
        params.data
      );
      console.log('Update Parent Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Update parent error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update parent');
    }
  }
);

export const deleteParent = createAsyncThunk(
  'parent/deleteParent',
  async (parentId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ADMIN_ENDPOINTS.DELETE_PARENT(parentId));
      console.log('Parent deleted successfully');
      return parentId;
    } catch (error: any) {
      console.error('Delete parent error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete parent');
    }
  }
);

export const getOccupations = createAsyncThunk(
  'parent/getOccupations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/parents/occupations/list');
      console.log('Occupations Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Occupations fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch occupations');
    }
  }
);

export const exportParentsCSV = createAsyncThunk(
  'parent/exportParentsCSV',
  async (
    params: { search?: string; occupation?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/parents/export/csv', {
        params: {
          search: params.search || '',
          occupation: params.occupation || '',
          status: params.status || '',
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Export error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to export parents');
    }
  }
);

// Slice
const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    clearSelectedParent: (state) => {
      state.selectedParent = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Parents
    builder
      .addCase(fetchParents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.loading = false;
        state.parents = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Parent By ID
    builder
      .addCase(fetchParentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedParent = action.payload;
      })
      .addCase(fetchParentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Parents
    builder
      .addCase(searchParents.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchParents.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchParents.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      });

    // Create Parent
    builder
      .addCase(createParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParent.fulfilled, (state, action) => {
        state.loading = false;
        state.parents.push(action.payload);
      })
      .addCase(createParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Parent
    builder
      .addCase(updateParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.parents.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.parents[index] = { ...state.parents[index], ...action.payload };
        }
        if (state.selectedParent?.id === action.payload.id) {
          state.selectedParent = { ...state.selectedParent, ...action.payload };
        }
      })
      .addCase(updateParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Parent
    builder
      .addCase(deleteParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParent.fulfilled, (state, action) => {
        state.loading = false;
        state.parents = state.parents.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Occupations
    builder
      .addCase(getOccupations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOccupations.fulfilled, (state, action) => {
        state.loading = false;
        state.occupations = action.payload || [];
      })
      .addCase(getOccupations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedParent, clearSearchResults } = parentSlice.actions;
export default parentSlice.reducer;
