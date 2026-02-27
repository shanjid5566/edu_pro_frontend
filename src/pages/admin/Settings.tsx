import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, Database, Save } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your school system preferences</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tabs */}
        <div className="w-full shrink-0 lg:w-56">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                <tab.icon className="h-4 w-4" />{tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-xl border border-border bg-card p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">School Name</label><input defaultValue="EduPro Academy" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">School Email</label><input defaultValue="admin@edupro.com" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label><input defaultValue="+1 234 567 890" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Academic Year</label><input defaultValue="2025-2026" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
              </div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Address</label><textarea rows={3} defaultValue="123 Education Blvd, Learning City, LC 10001" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none" /></div>
              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Save className="h-4 w-4" /> Save Changes</button>
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">JA</div>
                <div><button className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors">Upload Photo</button><p className="mt-1 text-xs text-muted-foreground">JPG, PNG max 2MB</p></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label><input defaultValue="John Anderson" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Email</label><input defaultValue="admin@school.com" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label><input defaultValue="+1 234 567 890" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Role</label><input value="Administrator" disabled className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground" /></div>
              </div>
              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Save className="h-4 w-4" /> Update Profile</button>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              {['Email Notifications', 'Push Notifications', 'SMS Alerts', 'Attendance Alerts', 'Exam Reminders', 'New Enrollment Alerts'].map(item => (
                <div key={item} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                  <div><p className="text-sm font-medium text-foreground">{item}</p><p className="text-xs text-muted-foreground">Receive {item.toLowerCase()} for important updates</p></div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-secondary peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-card after:transition-transform after:content-[''] peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              <div className="space-y-4">
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Current Password</label><input type="password" placeholder="••••••••" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label><input type="password" placeholder="••••••••" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Confirm New Password</label><input type="password" placeholder="••••••••" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" /></div>
              </div>
              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Shield className="h-4 w-4" /> Update Password</button>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-foreground">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div>
                  <button className="rounded-lg bg-success/10 px-4 py-2 text-sm font-medium text-success hover:bg-success/20 transition-colors">Enable</button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Light', 'Dark', 'System'].map(theme => (
                    <button key={theme} className={`rounded-lg border-2 p-4 text-center text-sm font-medium transition-colors ${theme === 'Light' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/50'}`}>{theme}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Sidebar Style</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Compact', 'Expanded'].map(style => (
                    <button key={style} className={`rounded-lg border-2 p-4 text-center text-sm font-medium transition-colors ${style === 'Expanded' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/50'}`}>{style}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
