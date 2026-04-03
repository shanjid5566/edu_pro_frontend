import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Calendar, Download, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { getAttendanceOverview, exportAttendanceCSV, getClasswiseAttendance } from '@/store/slices/attendanceSlice';
import StatsCard from '@/components/dashboard/StatsCard';
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Attendance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const { statistics, classwise, loading, overview } = useSelector((state: RootState) => state.attendance);
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(getAttendanceOverview()).unwrap();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error || 'Failed to load attendance overview',
          variant: 'destructive',
        });
      }
    };

    loadData();
  }, [dispatch, toast]);

  const handleExport = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await dispatch(exportAttendanceCSV({
        startDate: today,
        endDate: today,
      })).unwrap();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast({
        title: 'Success',
        description: 'Attendance exported successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to export attendance',
        variant: 'destructive',
      });
    }
  };

  const attendanceChartData = [
    { name: 'Present', value: statistics.present, color: 'hsl(142, 76%, 36%)' },
    { name: 'Absent', value: statistics.absent, color: 'hsl(0, 84%, 60%)' },
    { name: 'Late', value: statistics.late, color: 'hsl(38, 92%, 50%)' },
  ];

  if (loading && !overview) {
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
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Daily attendance overview and reports</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <button
            onClick={handleExport}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Present Today"
          value={statistics.present?.toString() || '0'}
          change={`${(statistics.presentPercentage || 0).toFixed(1)}% attendance`}
          changeType="positive"
          icon={CheckCircle}
          glowClass="stat-glow-success"
        />
        <StatsCard
          title="Absent Today"
          value={statistics.absent?.toString() || '0'}
          change={`${(statistics.absentPercentage || 0).toFixed(1)}% of total`}
          changeType="negative"
          icon={XCircle}
        />
        <StatsCard
          title="Late Arrivals"
          value={statistics.late?.toString() || '0'}
          change={`${(statistics.latePercentage || 0).toFixed(1)}% of total`}
          changeType="neutral"
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="mb-4 text-base font-semibold text-foreground">Today's Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={attendanceChartData.filter((d) => d.value > 0 || d.name === 'Present')}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {attendanceChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            {attendanceChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-5 lg:col-span-2"
        >
          <h3 className="mb-4 text-base font-semibold text-foreground">Class-wise Attendance</h3>
          <div className="overflow-x-auto">
            {classwise && classwise.length > 0 ? (
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
                  {classwise.map((row) => (
                    <tr key={row.classId} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-medium text-foreground">
                        {row.className}
                      </td>
                      <td className="py-2.5 text-center text-success">{row.present}</td>
                      <td className="py-2.5 text-center text-destructive">{row.absent}</td>
                      <td className="py-2.5 text-center text-warning">{row.late}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`text-xs font-medium ${
                            row.rate >= 90 ? 'text-success' : 'text-warning'
                          }`}
                        >
                          {row.rate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No attendance data available
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Attendance;
