import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, Save, Loader } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchGeneralSettings,
  fetchNotificationSettings,
  fetchPreferences,
  fetchProfileSettings,
  updateGeneralSettings,
  updateNotificationSettings,
  updatePassword,
  updatePreferences,
  updateProfileSettings,
} from '@/store/slices/settingsSlice';
import { useToast } from '@/components/ui/use-toast';

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
] as const;

type SettingsTab = (typeof tabs)[number]['id'];

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { general, profile, notifications, preferences, loading, passwordLoading } = useSelector(
    (state: RootState) => state.settings
  );

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const [generalForm, setGeneralForm] = useState(general);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    avatar: '',
    address: '',
    dateOfBirth: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
  });
  const [notificationForm, setNotificationForm] = useState({
    emailNotifications: false,
    pushNotifications: false,
    smsAlerts: false,
    attendanceAlerts: false,
    examReminders: false,
    enrollmentAlerts: false,
  });
  const [preferenceForm, setPreferenceForm] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    sidebarStyle: 'expanded' as 'compact' | 'expanded',
    language: 'en',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    dispatch(fetchGeneralSettings());
    dispatch(fetchProfileSettings());
    dispatch(fetchNotificationSettings());
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    setGeneralForm(general);
  }, [general]);

  useEffect(() => {
    setProfileForm({
      fullName: profile.fullName || '',
      phone: profile.phone || '',
      avatar: profile.avatar || '',
      address: profile.address || '',
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      gender: profile.gender || 'MALE',
    });
  }, [profile]);

  useEffect(() => {
    setNotificationForm({
      emailNotifications: notifications.emailNotifications,
      pushNotifications: notifications.pushNotifications,
      smsAlerts: notifications.smsAlerts,
      attendanceAlerts: notifications.attendanceAlerts,
      examReminders: notifications.examReminders,
      enrollmentAlerts: notifications.enrollmentAlerts,
    });
  }, [notifications]);

  useEffect(() => {
    setPreferenceForm({
      theme: preferences.theme,
      sidebarStyle: preferences.sidebarStyle,
      language: preferences.language,
    });
  }, [preferences]);

  const notifySuccess = (description: string) => {
    toast({
      title: 'Success',
      description,
    });
  };

  const notifyError = (description: string) => {
    toast({
      title: 'Error',
      description,
      variant: 'destructive',
    });
  };

  const handleSaveGeneral = async () => {
    try {
      await dispatch(updateGeneralSettings(generalForm)).unwrap();
      notifySuccess('General settings updated successfully');
    } catch (error: any) {
      notifyError(error || 'Failed to update general settings');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfileSettings(profileForm)).unwrap();
      notifySuccess('Profile updated successfully');
    } catch (error: any) {
      notifyError(error || 'Failed to update profile');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await dispatch(updateNotificationSettings(notificationForm)).unwrap();
      notifySuccess('Notification preferences updated successfully');
    } catch (error: any) {
      notifyError(error || 'Failed to update notification preferences');
    }
  };

  const handleSavePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      notifyError('All password fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notifyError('New password and confirm password do not match');
      return;
    }

    try {
      await dispatch(updatePassword(passwordForm)).unwrap();
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      notifySuccess('Password updated successfully');
    } catch (error: any) {
      notifyError(error || 'Failed to update password');
    }
  };

  const handleSavePreferences = async () => {
    try {
      await dispatch(updatePreferences(preferenceForm)).unwrap();
      notifySuccess('Preferences updated successfully');
    } catch (error: any) {
      notifyError(error || 'Failed to update preferences');
    }
  };

  const toggleNotification = (key: keyof typeof notificationForm) => {
    setNotificationForm((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const profileInitials = profileForm.fullName
    ? profileForm.fullName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'AD';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your school system preferences</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full shrink-0 lg:w-56">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 rounded-xl border border-border bg-card p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">School Name</label>
                  <input
                    value={generalForm.schoolName}
                    onChange={(e) => setGeneralForm((prev) => ({ ...prev, schoolName: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">School Email</label>
                  <input
                    type="email"
                    value={generalForm.schoolEmail}
                    onChange={(e) => setGeneralForm((prev) => ({ ...prev, schoolEmail: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                  <input
                    value={generalForm.phone}
                    onChange={(e) => setGeneralForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Academic Year</label>
                  <input
                    value={generalForm.academicYear}
                    onChange={(e) => setGeneralForm((prev) => ({ ...prev, academicYear: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Address</label>
                <textarea
                  rows={3}
                  value={generalForm.address}
                  onChange={(e) => setGeneralForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>
              <button
                onClick={handleSaveGeneral}
                disabled={loading}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {profileInitials}
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Avatar URL</label>
                  <input
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                  <input
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <input
                    value={profile.email}
                    disabled
                    className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                  <input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
                  <input
                    value={profile.role}
                    disabled
                    className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Date of Birth</label>
                  <input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Gender</label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER',
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Address</label>
                <textarea
                  rows={3}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Update Profile
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              {[
                {
                  key: 'emailNotifications',
                  title: 'Email Notifications',
                  description: 'Receive email notifications for important updates',
                },
                {
                  key: 'pushNotifications',
                  title: 'Push Notifications',
                  description: 'Receive push notifications in the app',
                },
                {
                  key: 'smsAlerts',
                  title: 'SMS Alerts',
                  description: 'Receive SMS alerts for critical events',
                },
                {
                  key: 'attendanceAlerts',
                  title: 'Attendance Alerts',
                  description: 'Get notified for attendance-related updates',
                },
                {
                  key: 'examReminders',
                  title: 'Exam Reminders',
                  description: 'Get reminders for upcoming exams',
                },
                {
                  key: 'enrollmentAlerts',
                  title: 'New Enrollment Alerts',
                  description: 'Get notified for new student enrollments',
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={notificationForm[item.key as keyof typeof notificationForm]}
                      onChange={() => toggleNotification(item.key as keyof typeof notificationForm)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-secondary peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-card after:transition-transform after:content-[''] peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
              <button
                onClick={handleSaveNotifications}
                disabled={loading}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    placeholder="********"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="********"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="********"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={handleSavePassword}
                disabled={passwordLoading}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {passwordLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />} Update Password
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'system'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() =>
                        setPreferenceForm((prev) => ({
                          ...prev,
                          theme: theme as 'light' | 'dark' | 'system',
                        }))
                      }
                      className={`rounded-lg border-2 p-4 text-center text-sm font-medium transition-colors ${
                        preferenceForm.theme === theme
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-foreground hover:border-primary/50'
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Sidebar Style</p>
                <div className="grid grid-cols-2 gap-3">
                  {['compact', 'expanded'].map((style) => (
                    <button
                      key={style}
                      onClick={() =>
                        setPreferenceForm((prev) => ({
                          ...prev,
                          sidebarStyle: style as 'compact' | 'expanded',
                        }))
                      }
                      className={`rounded-lg border-2 p-4 text-center text-sm font-medium transition-colors ${
                        preferenceForm.sidebarStyle === style
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-foreground hover:border-primary/50'
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSavePreferences}
                disabled={loading}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Appearance
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
