import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const todayData = [
  { name: 'Present', value: 1178, color: 'hsl(142, 76%, 36%)' },
  { name: 'Absent', value: 47, color: 'hsl(0, 84%, 60%)' },
  { name: 'Late', value: 22, color: 'hsl(38, 92%, 50%)' },
];

const classAttendance = [
  { class: '10-A', present: 33, absent: 1, late: 1, total: 35 },
  { class: '10-B', present: 30, absent: 2, late: 0, total: 32 },
  { class: '9-A', present: 35, absent: 2, late: 1, total: 38 },
  { class: '9-B', present: 34, absent: 1, late: 1, total: 36 },
  { class: '8-A', present: 32, absent: 1, late: 1, total: 34 },
  { class: '8-B', present: 28, absent: 1, late: 1, total: 30 },
  { class: '7-A', present: 26, absent: 2, late: 0, total: 28 },
];

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState('2026-02-26');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Daily attendance overview and reports</p>
        </div>
        <div className="flex gap-2">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors"><Download className="h-4 w-4" /> Export</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Present Today" value="1,178" change="94.5% attendance" changeType="positive" icon={CheckCircle} glowClass="stat-glow-success" />
        <StatsCard title="Absent Today" value="47" change="3.8% of total" changeType="negative" icon={XCircle} />
        <StatsCard title="Late Arrivals" value="22" change="1.7% of total" changeType="neutral" icon={Clock} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Today's Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={todayData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                {todayData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            {todayData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />{d.name} ({d.value})
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 text-base font-semibold text-foreground">Class-wise Attendance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left font-semibold text-foreground">Class</th>
                  <th className="pb-2 text-center font-semibold text-success">Present</th>
                  <th className="pb-2 text-center font-semibold text-destructive">Absent</th>
                  <th className="pb-2 text-center font-semibold text-warning">Late</th>
                  <th className="pb-2 text-right font-semibold text-foreground">Rate</th>
                </tr>
              </thead>
              <tbody>
                {classAttendance.map(row => (
                  <tr key={row.class} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-medium text-foreground">{row.class}</td>
                    <td className="py-2.5 text-center text-success">{row.present}</td>
                    <td className="py-2.5 text-center text-destructive">{row.absent}</td>
                    <td className="py-2.5 text-center text-warning">{row.late}</td>
                    <td className="py-2.5 text-right">
                      <span className={`text-xs font-medium ${Math.round(row.present / row.total * 100) >= 90 ? 'text-success' : 'text-warning'}`}>
                        {Math.round(row.present / row.total * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Attendance;
