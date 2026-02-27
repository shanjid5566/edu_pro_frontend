import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { mockAttendanceData, mockPerformanceData } from '@/services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const TeacherDashboard = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, Emily! Here's your overview.</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="My Classes" value={5} icon={BookOpen} change="2 today" changeType="neutral" />
      <StatsCard title="Total Students" value={142} icon={TrendingUp} change="+3 this week" changeType="positive" />
      <StatsCard title="Classes Taken" value={342} icon={Clock} />
      <StatsCard title="Avg Performance" value="82%" icon={Award} change="+4% vs last month" changeType="positive" />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Class Attendance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={mockAttendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Line type="monotone" dataKey="attendance" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--accent))' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Student Performance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={mockPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="average" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

export default TeacherDashboard;
