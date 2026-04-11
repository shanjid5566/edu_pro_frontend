import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, Bell, ChevronDown, Users, Loader, AlertCircle, BookOpen, BarChart3, TrendingUp } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchChildren,
  fetchChildOverview,
  fetchAttendanceTrend,
  fetchRecentResults,
  fetchSubjectPerformance,
  fetchUpcomingEvents,
  fetchNotifications,
  selectChild,
  clearError,
  Child,
} from '@/store/slices/parentDashboardSlice';
import StatsCard from '@/components/dashboard/StatsCard';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const categoryColors: Record<string, string> = {
  EVENT: 'bg-blue-100 text-blue-700 border-blue-200',
  GENERAL: 'bg-gray-100 text-gray-700 border-gray-200',
  HOLIDAY: 'bg-purple-100 text-purple-700 border-purple-200',
  EXAM: 'bg-orange-100 text-orange-700 border-orange-200',
};

const categoryIcons: Record<string, typeof Bell> = {
  EVENT: Users,
  GENERAL: Bell,
  HOLIDAY: Calendar,
  EXAM: BookOpen,
};

const ParentDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const {
    children,
    selectedChildId,
    overview,
    attendanceTrend,
    recentResults,
    subjectPerformance,
    upcomingEvents,
    notifications,
    loading,
    error,
  } = useSelector((state: RootState) => state.parentDashboard);

  const [showChildPicker, setShowChildPicker] = useState(false);

  // Initialize - fetch children on mount
  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  // Fetch child data when selected child changes
  useEffect(() => {
    if (selectedChildId) {
      const loadChildData = async () => {
        try {
          await Promise.all([
            dispatch(fetchChildOverview(selectedChildId)).unwrap(),
            dispatch(fetchAttendanceTrend({ studentId: selectedChildId, months: 6 })).unwrap(),
            dispatch(fetchRecentResults({ studentId: selectedChildId, limit: 5 })).unwrap(),
            dispatch(fetchSubjectPerformance(selectedChildId)).unwrap(),
            dispatch(fetchUpcomingEvents({ studentId: selectedChildId, limit: 5 })).unwrap(),
            dispatch(fetchNotifications({ studentId: selectedChildId, limit: 5 })).unwrap(),
          ]);
        } catch (err: any) {
          toast({
            title: 'Error',
            description: err || 'Failed to load data',
            variant: 'destructive',
          });
        }
      };

      loadChildData();
    }
  }, [selectedChildId, dispatch, toast]);

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

  const selectedChild = children.find((c) => c.studentId === selectedChildId);

  const handleSelectChild = (child: Child) => {
    dispatch(selectChild(child.studentId));
    setShowChildPicker(false);
  };

  if (loading && !overview && !children.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your children's academic progress</p>
        </div>

        {/* Child Selector */}
        {children.length > 0 && selectedChild && (
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

            {showChildPicker && children.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card shadow-lg z-20"
              >
                <div className="p-2">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Select Child</p>
                  {children.map((child) => (
                    <button
                      key={child.studentId}
                      onClick={() => handleSelectChild(child)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        selectedChild.studentId === child.studentId ? 'bg-primary/10' : 'hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{child.name}</p>
                        <p className="text-xs text-muted-foreground">Class {child.class}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title={`${overview.studentName.split(' ')[0]}'s Attendance`}
            value={`${overview.attendance.percentage}%`}
            icon={Calendar}
            change={overview.attendance.status}
            changeType="positive"
          />
          <StatsCard title="Overall Grade" value={overview.overallGrade} icon={Award} />
          <StatsCard title="Subjects" value={overview.subjects} icon={GraduationCap} />
          <StatsCard
            title="Class Rank"
            value={`${overview.classRank}/${overview.totalClassSize}`}
            icon={Users}
            change="This semester"
            changeType="neutral"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Trend */}
        {attendanceTrend.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                Attendance Trend — {selectedChild?.name.split(' ')[0]}
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  domain={[0, 100]}
                />
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
                  stroke="var(--color-warning)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--color-warning)' }}
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">School Notifications</h3>
          </div>
          {notifications.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = categoryIcons[n.category] || Bell;
                const colorClass = categoryColors[n.category] || categoryColors.GENERAL;

                return (
                  <div key={n.id} className={`flex items-start gap-3 rounded-lg border p-3 ${colorClass}`}>
                    <Icon className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs opacity-90 line-clamp-2">{n.message}</p>
                      <p className="text-xs opacity-75 mt-1">{n.timeAgo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
      </div>

      {/* Subject Performance */}
      {subjectPerformance.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Subject Performance</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {subjectPerformance.map((subject) => (
              <div key={subject.subjectId} className="rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">{subject.subject}</h4>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">{subject.grade}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{subject.exams} exam{subject.exams !== 1 ? 's' : ''}</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-foreground">{subject.percentage}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className={`h-full ${
                      subject.percentage >= 80
                        ? 'bg-success'
                        : subject.percentage >= 60
                          ? 'bg-info'
                          : 'bg-warning'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Recent Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Exam</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Subject</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Date</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Marks</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Grade</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((result, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-3 py-2 text-foreground">{result.examName}</td>
                    <td className="px-3 py-2 text-foreground">{result.subject}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {new Date(result.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-3 py-2 font-medium text-foreground">
                      {result.marksObtained}/{result.totalMarks}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          result.grade === 'A+'
                            ? 'bg-green-100 text-green-700'
                            : result.grade === 'A'
                              ? 'bg-green-50 text-green-600'
                              : result.grade.startsWith('B')
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {result.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Upcoming Events</h3>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-secondary/30 transition-colors">
                <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ParentDashboard;
