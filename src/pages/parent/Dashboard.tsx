import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, Bell, ChevronDown, Users } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { mockAttendanceData } from '@/services/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const children = [
  { id: '1', name: 'Alex Thompson', class: '10-A', attendance: '96%', grade: 'A', subjects: 6, rank: '#5' },
  { id: '2', name: 'Emma Thompson', class: '7-B', attendance: '92%', grade: 'B+', subjects: 5, rank: '#12' },
];

const notifications = [
  { id: 1, text: 'Mid-term exam results are now available', time: '2 hours ago' },
  { id: 2, text: 'Parent-teacher meeting on March 15th', time: '1 day ago' },
  { id: 3, text: 'Alex achieved A+ in Mathematics', time: '2 days ago' },
  { id: 4, text: 'Annual Sports Day on March 20th', time: '3 days ago' },
];

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(children[0]);
  const [showChildPicker, setShowChildPicker] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your children's academic progress</p>
        </div>

        {/* Child Selector */}
        <div className="relative">
          <button
            onClick={() => setShowChildPicker(!showChildPicker)}
            className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {selectedChild.name.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{selectedChild.name}</p>
              <p className="text-xs text-muted-foreground">Class {selectedChild.class}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showChildPicker ? 'rotate-180' : ''}`} />
          </button>

          {showChildPicker && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card shadow-lg z-20"
            >
              <div className="p-2">
                <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Select Child</p>
                {children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => { setSelectedChild(child); setShowChildPicker(false); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${selectedChild.id === child.id ? 'bg-primary/10' : 'hover:bg-secondary/50'}`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{child.name}</p>
                      <p className="text-xs text-muted-foreground">Class {child.class} · Grade {child.grade}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title={`${selectedChild.name.split(' ')[0]}'s Attendance`} value={selectedChild.attendance} icon={Calendar} change="Excellent" changeType="positive" />
        <StatsCard title="Overall Grade" value={selectedChild.grade} icon={Award} />
        <StatsCard title="Subjects" value={selectedChild.subjects} icon={GraduationCap} />
        <StatsCard title="Class Rank" value={selectedChild.rank} icon={Users} change="This semester" changeType="neutral" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Attendance Trend — {selectedChild.name.split(' ')[0]}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mockAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              <Line type="monotone" dataKey="attendance" stroke="hsl(var(--warning))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--warning))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">School Notifications</h3>
          <div className="space-y-4">
            {notifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-warning/10 p-2">
                  <Bell className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{n.text}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ParentDashboard;
