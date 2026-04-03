import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { navigationItems } from '@/constants/navigation';
import {
  LayoutDashboard, GraduationCap, Users, UserCheck, School,
  FileText, ClipboardCheck, MessageSquare, Settings, Award,
  TrendingUp, ChevronLeft, LogOut, X, CreditCard, Megaphone, Calendar,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, GraduationCap, Users, UserCheck, School,
  FileText, ClipboardCheck, MessageSquare, Settings, Award, TrendingUp, CreditCard, Megaphone, Calendar,
};

const AppSidebar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  console.log('AppSidebar - User role:', user?.role);
  const items = navigationItems.filter(item => {
    const matches = item.roles.includes(user.role);
    console.log(`Checking if "${user?.role}" in [${item.roles.join(', ')}]:`, matches);
    return matches;
  });
  console.log('Filtered items:', items);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col sidebar-gradient transition-all duration-300 lg:relative lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[72px]' : 'w-64'}`}
      >
        <div className={`flex h-16 items-center border-b border-sidebar-border ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-bold text-sidebar-primary-foreground"
              >
                EduPro
              </motion.span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary-foreground transition-colors lg:flex"
              title={collapsed ? "Expand" : "Collapse"}
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={toggleSidebar} className="text-sidebar-foreground hover:text-sidebar-primary-foreground lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = location.pathname === item.href;

              const linkContent = (
                <Link
                  to={item.href}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-primary/20 text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                  {!collapsed && <span>{item.title}</span>}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              );

              return (
                <li key={item.href}>
                  {collapsed ? (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`border-t border-sidebar-border p-3 space-y-1`}>

          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default AppSidebar;
