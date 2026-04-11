import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BookOpen, Calendar, TrendingDown, Loader, AlertCircle } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchProgressMetrics,
  fetchProgressTimeline,
  fetchProgressSubjects,
  fetchProgressExamResults,
  fetchProgressSummary,
  clearError,
} from '@/store/slices/parentProgressSlice';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ParentProgress = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { metrics, timeline, subjects, examResults, summary, loading, error } = useSelector(
    (state: RootState) => state.parentProgress,
  );

  // Initialize - fetch all progress data
  useEffect(() => {
    if (!studentId) return;

    const loadProgressData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProgressMetrics(studentId)).unwrap(),
          dispatch(fetchProgressTimeline({ studentId, months: 6 })).unwrap(),
          dispatch(fetchProgressSubjects(studentId)).unwrap(),
          dispatch(fetchProgressExamResults({ studentId, limit: 10 })).unwrap(),
          dispatch(fetchProgressSummary(studentId)).unwrap(),
        ]);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err || 'Failed to load progress data',
          variant: 'destructive',
        });
      }
    };

    loadProgressData();
  }, [studentId, dispatch, toast]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  if (loading && !metrics) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Child's Progress</h1>
        <p className="text-muted-foreground">Track {metrics?.studentName}'s academic performance</p>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Current Grade</p>
            <p className="mt-1 text-2xl font-bold text-success">{metrics.currentGrade}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Class Rank</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              #{metrics.classRank.rank} / {metrics.classRank.totalStudents}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Attendance</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{metrics.attendance}%</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Avg Score</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{metrics.avgScore}%</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timeline Chart */}
        {timeline.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Progress Over Time</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Legend wrapperStyle={{ color: 'var(--color-muted-foreground)' }} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="var(--color-success)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--color-success)' }}
                  name="Score %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Subject Performance Chart */}
        {subjects.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Subject Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={subjects}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="subject" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
                <Legend wrapperStyle={{ color: 'var(--color-muted-foreground)' }} />
                <Bar dataKey="percentage" fill="var(--color-warning)" radius={[6, 6, 0, 0]} name="Percentage" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Performance Summary</h3>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Exams</p>
              <p className="text-2xl font-bold text-foreground">{summary.totalExams}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Average %</p>
              <p className="text-2xl font-bold text-primary">{summary.averagePercentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Highest %</p>
              <p className="text-2xl font-bold text-success">{summary.highestPercentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Lowest %</p>
              <p className="text-2xl font-bold text-warning">{summary.lowestPercentage}%</p>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <p className="text-sm font-medium text-foreground">Grade Distribution</p>
            <div className="grid grid-cols-7 gap-2">
              {Object.entries(summary.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <p className="text-xs font-bold text-foreground">{grade}</p>
                  <p className="text-lg font-bold text-primary">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Exam Results */}
      {examResults.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Recent Exam Results</h3>
          </div>
          <div className="space-y-3">
            {examResults.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <Award className="h-4 w-4 text-warning shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{e.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{e.examName}</span>
                      <span>•</span>
                      <span>
                        {new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{e.marksObtained}/{e.totalMarks}</p>
                    <p className={`text-xs font-bold ${
                      e.percentage >= 80
                        ? 'text-success'
                        : e.percentage >= 60
                          ? 'text-info'
                          : 'text-warning'
                    }`}>
                      {e.percentage}%
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {e.trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
                    {e.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      e.grade === 'A+'
                        ? 'bg-green-100 text-green-700'
                        : e.grade === 'A'
                          ? 'bg-green-50 text-green-600'
                          : e.grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {e.grade}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ParentProgress;
