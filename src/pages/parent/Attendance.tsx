import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockAttendanceData } from '@/services/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const recentAttendance = [
  { date: '2026-02-26', day: 'Thursday', status: 'present' },
  { date: '2026-02-25', day: 'Wednesday', status: 'present' },
  { date: '2026-02-24', day: 'Tuesday', status: 'present' },
  { date: '2026-02-23', day: 'Monday', status: 'late' },
  { date: '2026-02-20', day: 'Friday', status: 'present' },
  { date: '2026-02-19', day: 'Thursday', status: 'absent' },
  { date: '2026-02-18', day: 'Wednesday', status: 'present' },
  { date: '2026-02-17', day: 'Tuesday', status: 'present' },
  { date: '2026-02-14', day: 'Friday', status: 'present' },
  { date: '2026-02-13', day: 'Thursday', status: 'present' },
];

const statusConfig = {
  present: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Present' },
  absent: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Absent' },
  late: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Late' },
};

const ParentAttendance = () => {
  const presentDays = recentAttendance.filter(a => a.status === 'present').length;
  const absentDays = recentAttendance.filter(a => a.status === 'absent').length;
  const lateDays = recentAttendance.filter(a => a.status === 'late').length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Child's Attendance</h1>
        <p className="text-muted-foreground">Monitor Alex Thompson's attendance record</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 text-center"><p className="text-sm text-muted-foreground">Present</p><p className="mt-1 text-2xl font-bold text-success">{presentDays} days</p></div>
        <div className="rounded-xl border border-border bg-card p-5 text-center"><p className="text-sm text-muted-foreground">Absent</p><p className="mt-1 text-2xl font-bold text-destructive">{absentDays} day</p></div>
        <div className="rounded-xl border border-border bg-card p-5 text-center"><p className="text-sm text-muted-foreground">Late</p><p className="mt-1 text-2xl font-bold text-warning">{lateDays} day</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              <Area type="monotone" dataKey="attendance" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Recent Attendance</h3>
          <div className="space-y-2">
            {recentAttendance.map(a => {
              const config = statusConfig[a.status as keyof typeof statusConfig];
              const Icon = config.icon;
              return (
                <div key={a.date} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div><p className="text-sm font-medium text-foreground">{a.day}</p><p className="text-xs text-muted-foreground">{a.date}</p></div>
                  </div>
                  <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
                    <Icon className="h-3.5 w-3.5" />{config.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ParentAttendance;
