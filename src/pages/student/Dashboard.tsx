import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Award, TrendingUp, Loader, Users, GraduationCap } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import StatsCard from '@/components/dashboard/StatsCard';
import {
  fetchStudentDashboardOverview,
  fetchAttendanceTrend,
  fetchSubjectPerformance,
  fetchMyClass,
  fetchRecentResults,
} from '@/store/slices/studentDashboardSlice';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StudentDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { overview, attendanceTrend, subjectPerformance, myClass, recentResults, loading, error } = useSelector(
    (state: RootState) => state.studentDashboard,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudentDashboardOverview()).unwrap(),
          dispatch(fetchAttendanceTrend(6)).unwrap(),
          dispatch(fetchSubjectPerformance()).unwrap(),
          dispatch(fetchMyClass()).unwrap(),
          dispatch(fetchRecentResults(5)).unwrap(),
        ]);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err || 'Failed to load dashboard',
          variant: 'destructive',
        });
      }
    };

    loadDashboard();
  }, [dispatch, toast]);

  if (loading && !overview) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground">{overview?.greeting || `Welcome back, ${user?.name}! Track your academic progress.`}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={overview?.statistics.mySubjects.label || 'My Subjects'}
          value={overview?.statistics.mySubjects.count ?? 0}
          icon={BookOpen}
        />
        <StatsCard
          title={overview?.statistics.attendance.label || 'Attendance'}
          value={`${overview?.statistics.attendance.percentage ?? 0}%`}
          icon={Calendar}
          change={overview?.statistics.attendance.status}
          changeType="positive"
        />
        <StatsCard
          title={overview?.statistics.overallGrade.label || 'Overall Grade'}
          value={overview?.statistics.overallGrade.grade ?? 'N/A'}
          icon={Award}
          change={`${overview?.statistics.overallGrade.percentage ?? 0}%`}
        />
        <StatsCard
          title={overview?.statistics.rank.label || 'Rank'}
          value={`#${overview?.statistics.rank.rank ?? 0}`}
          icon={TrendingUp}
          change={`out of ${overview?.statistics.rank.outOf ?? 0}`}
          changeType="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">My Attendance</h3>
          {attendanceTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Area type="monotone" dataKey="attendance" stroke="hsl(var(--info))" fill="hsl(var(--info) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground">No attendance data available</div>
          )}
        </div>

        {/* Subject Performance Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Subject Performance</h3>
          {subjectPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="percentage" fill="hsl(var(--info))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground">No performance data available</div>
          )}
        </div>
      </div>

      {/* My Class & Recent Results */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Class */}
        {myClass && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-base font-semibold text-foreground">My Class</h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary/50 p-4">
                <h4 className="text-lg font-bold text-foreground mb-3">{myClass.className}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Students</p>
                    <p className="font-medium text-foreground">{myClass.totalStudents}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Teachers</p>
                    <p className="font-medium text-foreground">{myClass.totalTeachers}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Subjects</p>
                    <p className="font-medium text-foreground">{myClass.totalSubjects}</p>
                  </div>
                </div>
              </div>

              {/* Teachers */}
              {myClass.teachers.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" /> Teachers
                  </h5>
                  <div className="space-y-2">
                    {myClass.teachers.map((teacher) => (
                      <div key={teacher.id} className="px-3 py-2 rounded-lg bg-secondary/50 text-sm text-foreground">
                        {teacher.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects */}
              {myClass.subjects.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                    <BookOpen className="h-4 w-4" /> Subjects
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {myClass.subjects.map((subject) => (
                      <div key={subject.id} className="px-3 py-2 rounded-lg bg-secondary/50 text-sm text-foreground text-center">
                        {subject.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Results */}
        {recentResults.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-base font-semibold text-foreground">Recent Results</h3>
            <div className="space-y-3">
              {recentResults.map((result) => (
                <div key={result.examId} className="rounded-lg border border-border/50 p-3 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-medium text-foreground">{result.examName}</p>
                      <p className="text-xs text-muted-foreground">{result.subject} • {result.class}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">{result.percentage}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.marksObtained} / {result.totalMarks} marks
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
