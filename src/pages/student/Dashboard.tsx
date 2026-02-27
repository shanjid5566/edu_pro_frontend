import { motion } from 'framer-motion';
import { BookOpen, Calendar, Award, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { mockPerformanceData, mockAttendanceData } from '@/services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StudentDashboard = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, Alex! Track your academic progress.</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="My Subjects" value={6} icon={BookOpen} />
      <StatsCard title="Attendance" value="96%" icon={Calendar} change="Above average" changeType="positive" />
      <StatsCard title="Overall Grade" value="A" icon={Award} />
      <StatsCard title="Rank" value="#5" icon={TrendingUp} change="Up 2 positions" changeType="positive" />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">My Attendance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockAttendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Area type="monotone" dataKey="attendance" stroke="hsl(var(--info))" fill="hsl(var(--info) / 0.1)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Subject Performance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={mockPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="average" fill="hsl(var(--info))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

export default StudentDashboard;
