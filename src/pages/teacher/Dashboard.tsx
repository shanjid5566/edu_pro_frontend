import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Loader } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import StatsCard from '@/components/dashboard/StatsCard';
import {
  fetchTeacherAttendanceTrend,
  fetchTeacherDashboardOverview,
  fetchTeacherStudentPerformance,
} from '@/store/slices/teacherDashboardSlice';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const TeacherDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { overview, attendanceTrend, studentPerformance, loading } = useSelector(
    (state: RootState) => state.teacherDashboard
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await Promise.all([
          dispatch(fetchTeacherDashboardOverview()).unwrap(),
          dispatch(fetchTeacherAttendanceTrend(6)).unwrap(),
          dispatch(fetchTeacherStudentPerformance()).unwrap(),
        ]);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error || 'Failed to load teacher dashboard',
          variant: 'destructive',
        });
      }
    };

    loadDashboard();
  }, [dispatch, toast]);

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'T';

  if (loading && !overview) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
            <p className="text-muted-foreground">{overview?.greeting || `Welcome back, ${user?.name || 'Teacher'}! Here is your overview.`}</p>
          </div>
        </div>
      </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title={overview?.statistics.myClasses.label || 'My Classes'}
        value={overview?.statistics.myClasses.count ?? 0}
        icon={BookOpen}
        change={overview?.statistics.myClasses.today ? `${overview.statistics.myClasses.today} today` : undefined}
        changeType="neutral"
      />
      <StatsCard
        title={overview?.statistics.totalStudents.label || 'Total Students'}
        value={overview?.statistics.totalStudents.count ?? 0}
        icon={TrendingUp}
        change={overview?.statistics.totalStudents.change}
        changeType="positive"
      />
      <StatsCard
        title={overview?.statistics.classesTaken.label || 'Classes Taken'}
        value={overview?.statistics.classesTaken.count ?? 0}
        icon={Clock}
      />
      <StatsCard
        title={overview?.statistics.avgPerformance.label || 'Avg Performance'}
        value={`${overview?.statistics.avgPerformance.percentage ?? 0}%`}
        icon={Award}
        change={overview?.statistics.avgPerformance.change}
        changeType="positive"
      />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Class Attendance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={attendanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Line type="monotone" dataKey="attendance" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--accent))' }} />
          </LineChart>
        </ResponsiveContainer>
        {attendanceTrend.length === 0 && (
          <p className="mt-2 text-center text-sm text-muted-foreground">No attendance trend data available</p>
        )}
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Student Performance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={studentPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="percentage" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {studentPerformance.length === 0 && (
          <p className="mt-2 text-center text-sm text-muted-foreground">No student performance data available</p>
        )}
      </div>
    </div>
    </motion.div>
  );
};

export default TeacherDashboard;
