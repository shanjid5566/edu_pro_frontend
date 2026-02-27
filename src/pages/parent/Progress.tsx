import { motion } from 'framer-motion';
import { TrendingUp, Award, BookOpen, Calendar, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const progressData = [
  { month: 'Sep', score: 72 },
  { month: 'Oct', score: 75 },
  { month: 'Nov', score: 78 },
  { month: 'Dec', score: 82 },
  { month: 'Jan', score: 80 },
  { month: 'Feb', score: 85 },
];

const subjectData = [
  { subject: 'Math', score: 92 },
  { subject: 'Physics', score: 85 },
  { subject: 'Chem', score: 78 },
  { subject: 'English', score: 88 },
  { subject: 'CS', score: 95 },
  { subject: 'History', score: 72 },
];

const recentExams = [
  { subject: 'Mathematics', marks: '92/100', grade: 'A+', trend: 'up' },
  { subject: 'Physics', marks: '85/100', grade: 'A', trend: 'up' },
  { subject: 'Chemistry', marks: '78/100', grade: 'B+', trend: 'down' },
  { subject: 'English', marks: '88/100', grade: 'A', trend: 'up' },
];

const ParentProgress = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Child's Progress</h1>
      <p className="text-muted-foreground">Track Alex Thompson's academic performance</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Current Grade</p><p className="mt-1 text-2xl font-bold text-success">A</p></div>
      <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Class Rank</p><p className="mt-1 text-2xl font-bold text-primary">#5 / 35</p></div>
      <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Attendance</p><p className="mt-1 text-2xl font-bold text-foreground">96%</p></div>
      <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Avg Score</p><p className="mt-1 text-2xl font-bold text-foreground">85%</p></div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Progress Over Time</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--success))' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Subject Performance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={subjectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="score" fill="hsl(var(--warning))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">Recent Exam Results</h3>
      <div className="space-y-3">
        {recentExams.map(e => (
          <div key={e.subject} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3"><Award className="h-4 w-4 text-warning" /><div><p className="text-sm font-medium text-foreground">{e.subject}</p><p className="text-xs text-muted-foreground">{e.marks}</p></div></div>
            <div className="flex items-center gap-2">
              {e.trend === 'up' ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{e.grade}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default ParentProgress;
