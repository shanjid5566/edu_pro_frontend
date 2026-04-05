import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { updatePreferences } from '@/store/slices/settingsSlice';
import { RootState, AppDispatch } from '@/store/store';
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, User, Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { preferences } = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = 0; // Placeholder for notifications
  const notifications = []; // Placeholder

  const toggleTheme = async () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(nextTheme === 'dark');
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');

    try {
      await dispatch(
        updatePreferences({
          theme: nextTheme,
          sidebarStyle: preferences.sidebarStyle,
          language: preferences.language,
        })
      ).unwrap();
    } catch {
      document.documentElement.classList.toggle('dark', isDarkMode);
      setIsDarkMode(isDarkMode);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const darkFromPreference =
      preferences.theme === 'dark' ||
      (preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(darkFromPreference);
    document.documentElement.classList.toggle('dark', darkFromPreference);
  }, [preferences.theme]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={() => {}} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-card shadow-lg"
              >
                <div className="border-b border-border p-4">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <button
                        key={n.id}
                        className={`flex w-full flex-col gap-1 border-b border-border p-4 text-left hover:bg-secondary/50 transition-colors`}
                      >
                        <span className="text-sm font-medium text-foreground">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{n.message}</span>
                        <span className="text-[10px] text-muted-foreground">{n.createdAt}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-secondary transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-[10px] capitalize text-muted-foreground">{user?.role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-card shadow-lg"
              >
                <div className="border-b border-border p-4">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="p-2">
                
                  <Link to={`/${user?.role}/settings`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
