import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export interface GeneralSettings {
  schoolName: string;
  schoolEmail: string;
  phone: string;
  academicYear: string;
  address: string;
}

export interface ProfileSettings {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  address: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface NotificationSettings {
  id: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  attendanceAlerts: boolean;
  examReminders: boolean;
  enrollmentAlerts: boolean;
}

export interface UserPreferences {
  id: string;
  theme: 'light' | 'dark' | 'system';
  sidebarStyle: 'compact' | 'expanded';
  language: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SettingsState {
  general: GeneralSettings;
  profile: ProfileSettings;
  notifications: NotificationSettings;
  preferences: UserPreferences;
  loading: boolean;
  passwordLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  general: {
    schoolName: '',
    schoolEmail: '',
    phone: '',
    academicYear: '',
    address: '',
  },
  profile: {
    id: '',
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    role: '',
    address: '',
    dateOfBirth: '',
    gender: 'MALE',
  },
  notifications: {
    id: '',
    emailNotifications: false,
    pushNotifications: false,
    smsAlerts: false,
    attendanceAlerts: false,
    examReminders: false,
    enrollmentAlerts: false,
  },
  preferences: {
    id: '',
    theme: 'light',
    sidebarStyle: 'expanded',
    language: 'en',
  },
  loading: false,
  passwordLoading: false,
  error: null,
};

export const fetchGeneralSettings = createAsyncThunk('settings/fetchGeneral', async () => {
  const response = await axiosInstance.get('/api/v1/admin/settings/general');
  return response.data.data as GeneralSettings;
});

export const updateGeneralSettings = createAsyncThunk(
  'settings/updateGeneral',
  async (payload: GeneralSettings) => {
    const response = await axiosInstance.put('/api/v1/admin/settings/general', payload);
    return response.data.data as GeneralSettings;
  }
);

export const fetchProfileSettings = createAsyncThunk('settings/fetchProfile', async () => {
  const response = await axiosInstance.get('/api/v1/admin/settings/profile');
  return response.data.data as ProfileSettings;
});

export const updateProfileSettings = createAsyncThunk(
  'settings/updateProfile',
  async (payload: {
    fullName: string;
    phone: string;
    avatar: string;
    address: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
  }) => {
    const response = await axiosInstance.put('/api/v1/admin/settings/profile', payload);
    return response.data.data as ProfileSettings;
  }
);

export const fetchNotificationSettings = createAsyncThunk(
  'settings/fetchNotifications',
  async () => {
    const response = await axiosInstance.get('/api/v1/admin/settings/notifications');
    return response.data.data as NotificationSettings;
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'settings/updateNotifications',
  async (payload: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
    attendanceAlerts: boolean;
    examReminders: boolean;
    enrollmentAlerts: boolean;
  }) => {
    const response = await axiosInstance.put('/api/v1/admin/settings/notifications', payload);
    return response.data.data as NotificationSettings;
  }
);

export const updatePassword = createAsyncThunk(
  'settings/updatePassword',
  async (payload: UpdatePasswordPayload) => {
    const response = await axiosInstance.put('/api/v1/admin/settings/security/password', payload);
    return response.data;
  }
);

export const fetchPreferences = createAsyncThunk('settings/fetchPreferences', async () => {
  const response = await axiosInstance.get('/api/v1/admin/settings/preferences');
  return response.data.data as UserPreferences;
});

export const updatePreferences = createAsyncThunk(
  'settings/updatePreferences',
  async (payload: {
    theme: 'light' | 'dark' | 'system';
    sidebarStyle: 'compact' | 'expanded';
    language: string;
  }) => {
    const response = await axiosInstance.put('/api/v1/admin/settings/preferences', payload);
    return response.data.data as UserPreferences;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeneralSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.general = action.payload;
      })
      .addCase(fetchGeneralSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch general settings';
      })
      .addCase(updateGeneralSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGeneralSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.general = action.payload;
      })
      .addCase(updateGeneralSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update general settings';
      })
      .addCase(fetchProfileSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfileSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile settings';
      })
      .addCase(updateProfileSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile settings';
      })
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notification settings';
      })
      .addCase(updateNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update notification settings';
      })
      .addCase(updatePassword.pending, (state) => {
        state.passwordLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.passwordLoading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.error.message || 'Failed to update password';
      })
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch preferences';
      })
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update preferences';
      });
  },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
