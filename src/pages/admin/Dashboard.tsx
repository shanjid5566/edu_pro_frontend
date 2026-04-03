import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { GraduationCap, Users, School, UserCheck, TrendingUp, Calendar } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { fetchDashboard } from '@/store/slices/adminSlice';
import { AppDispatch, RootState } from '@/store/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const pieData = [
  { name: 'Present', value: 94.2 },
  { name: 'Absent', value: 3.8 },
  { name: 'Late', value: 2 },
];
const PIE_COLORS = ['hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)', 'hsl(38, 92%, 50%)'];

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, attendanceData, performanceData, recentActivity, loading } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // Transform attendance data for chart (count -> attendance for compatibility)
  const chartAttendanceData = attendanceData.map(item => ({
    ...item,
    attendance: item.count,
  }));

  // Transform performance data (averageMarks -> average for compatibility)
  const chartPerformanceData = performanceData.map(item => ({
    ...item,
    average: item.averageMarks,
  }));

  // Format recent activities
  const formattedActivities = recentActivity.map(activity => ({
    id: activity.id,
    text: `${activity.user} - ${activity.description}`,
    time: new Date(activity.timestamp).toLocaleString(),
    icon: TrendingUp,
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your school.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Students" value={stats?.totalStudents.toLocaleString() || '0'} change="+12 this month" changeType="positive" icon={GraduationCap} glowClass="stat-glow-primary" />
        <StatsCard title="Total Teachers" value={stats?.totalTeachers.toString() || '0'} change="+2 this month" changeType="positive" icon={Users} glowClass="stat-glow-success" />
        <StatsCard title="Total Classes" value={stats?.totalClasses.toString() || '0'} change="3 new sections" changeType="neutral" icon={School} glowClass="stat-glow-warning" />
        <StatsCard title="Total Parents" value={stats?.totalParents.toLocaleString() || '0'} change="+8 this month" changeType="positive" icon={UserCheck} glowClass="stat-glow-accent" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
              />
              <Line type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance by Subject */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Performance by Subject</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="average" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Today's Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                {entry.name} ({entry.value}%)
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 text-base font-semibold text-foreground">Recent Activity</h3>
          <div className="space-y-4">
            {formattedActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
