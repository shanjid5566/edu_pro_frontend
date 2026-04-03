import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { UserRole } from '@/types';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

const initialState: AuthState = {
  user: (() => {
    try {
      const stored = localStorage.getItem('authUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('authToken') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
};

// Login async thunk
export const loginAsync = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/loginAsync',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/v1/auth/login', credentials);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data.data);
      
      let { token, user } = response.data.data;
      console.log('Extracted user:', user);
      console.log('User role (raw):', user?.role);
      
      // Normalize role to lowercase and cast as UserRole
      if (user && user.role) {
        const normalizedRole = user.role.toLowerCase() as UserRole;
        user = { ...user, role: normalizedRole };
      }
      console.log('User role (normalized):', user?.role);

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));

      return { success: true, token, user };
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Fetch profile async thunk
export const fetchProfile = createAsyncThunk<LoginResponse, void, { rejectValue: string }>(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/auth/profile');
      console.log('Profile Response:', response);
      
      let user = response.data.data;
      console.log('Fetched user:', user);
      
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      // Normalize role to lowercase and cast as UserRole
      if (user && user.role) {
        const normalizedRole = user.role.toLowerCase() as UserRole;
        user = { ...user, role: normalizedRole };
      }
      
      localStorage.setItem('authUser', JSON.stringify(user));
      
      return { success: true, token: token || '', user };
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login pending
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login fulfilled
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      // Login rejected
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      })
      // Fetch profile pending
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch profile fulfilled
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      // Fetch profile rejected
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile';
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
