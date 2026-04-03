import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@edupro.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Auto-redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const roleRoute = user.role.toLowerCase();
      console.log('Redirecting to:', `/${roleRoute}/dashboard`);
      navigate(`/${roleRoute}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    console.log('Submitting login with:', { email, password });
    await dispatch(loginAsync({ email, password }));
  };

  // Role-specific credentials for quick login
  const roleCredentials: Record<UserRole, { email: string; password: string }> = {
    admin: { email: 'admin@edupro.com', password: 'password123' },
    teacher: { email: 'sarah@edupro.com', password: 'password123' },
    student: { email: 'alice.johnson@edupro.com', password: 'password123' },
    parent: { email: 'parent@edupro.com', password: 'password123' },
  };

  // Handle role selection and auto-fill credentials
  const handleRoleSelect = (selectedRole: UserRole) => {
    setEmail(roleCredentials[selectedRole].email);
    setPassword(roleCredentials[selectedRole].password);
  };

  const roles: { value: UserRole; label: string; color: string }[] = [
    { value: 'admin', label: 'Admin', color: 'bg-primary' },
    { value: 'teacher', label: 'Teacher', color: 'bg-accent' },
    { value: 'student', label: 'Student', color: 'bg-info' },
    { value: 'parent', label: 'Parent', color: 'bg-warning' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient flex-col items-center justify-center p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-accent/30 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md text-center"
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">EduPro</h1>
          <p className="text-lg opacity-80">
            Complete school management platform. Manage students, teachers, exams, and more — all in one place.
          </p>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex w-full items-center justify-center bg-background p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">EduPro</span>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="mb-8 text-muted-foreground">Sign in to your account to continue</p>

          {/* Role selector */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-foreground">Quick Login - Choose a Role</label>
            <div className="grid grid-cols-4 gap-2">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleRoleSelect(r.value)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    email === roleCredentials[r.value].email
                      ? `${r.color} text-primary-foreground shadow-md`
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">💡 Click a role to auto-fill credentials, then click Sign In</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
