import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Save, Calendar, Users, Loader } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchTeacherClassesForAttendance,
  fetchClassStudents,
  markAttendance,
  fetchAttendanceRecords,
  clearError,
} from '@/store/slices/teacherAttendanceSlice';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/use-toast';

type Status = 'PRESENT' | 'ABSENT' | 'LATE';

const statusIcon = { PRESENT: CheckCircle, ABSENT: XCircle, LATE: Clock };
const statusColor = {
  PRESENT: 'text-success bg-success/10',
  ABSENT: 'text-destructive bg-destructive/10',
  LATE: 'text-warning bg-warning/10',
};

const TeacherAttendance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { assignedClasses, currentClassData, attendanceRecords, loading, recordsLoading, marking, error } = useSelector(
    (state: RootState) => state.teacherAttendance,
  );

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Initialize page - fetch assigned classes
  useEffect(() => {
    dispatch(fetchTeacherClassesForAttendance());
  }, [dispatch]);

  // When selected class changes, fetch students for that class
  useEffect(() => {
    if (selectedClassId) {
      dispatch(fetchClassStudents(selectedClassId)).then(() => {
        // Initialize attendance as present for all students
        setAttendance({});
      });
      // Fetch past records
      dispatch(
        fetchAttendanceRecords({
          classId: selectedClassId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
      );
    }
  }, [selectedClassId, dispatch]);

  // Initialize attendance state when students are loaded
  useEffect(() => {
    if (currentClassData && Object.keys(attendance).length === 0) {
      setAttendance(Object.fromEntries(currentClassData.students.map((s) => [s.studentId, 'PRESENT' as Status])));
    }
  }, [currentClassData, attendance]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
  };

  const setStatus = (studentId: string, status: Status) => setAttendance((prev) => ({ ...prev, [studentId]: status }));

  const students = currentClassData?.students || [];
  const presentCount = Object.values(attendance).filter((v) => v === 'PRESENT').length;
  const absentCount = Object.values(attendance).filter((v) => v === 'ABSENT').length;
  const lateCount = Object.values(attendance).filter((v) => v === 'LATE').length;

  const handleSave = async () => {
    if (!selectedClassId) return;

    const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      await dispatch(
        markAttendance({
          classId: selectedClassId,
          attendanceData,
          date: selectedDate,
        }),
      ).unwrap();

      setShowConfirmModal(false);
      toast({
        title: 'Success',
        description: `Attendance for ${currentClassData?.class.name}-${currentClassData?.class.section} on ${selectedDate} has been saved successfully.`,
      });

      // Refresh records
      if (selectedClassId) {
        dispatch(
          fetchAttendanceRecords({
            classId: selectedClassId,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
        );
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err || 'Failed to save attendance',
        variant: 'destructive',
      });
    }
  };

  const markAll = (status: Status) => {
    setAttendance(Object.fromEntries(students.map((s) => [s.studentId, status])));
  };

  if (loading && !selectedClassId) {
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
          <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
          <p className="text-muted-foreground">Record student attendance for your classes</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <select
            value={selectedClassId || ''}
            onChange={(e) => handleClassChange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Select Class</option>
            {assignedClasses.map((cls) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedClassId && currentClassData && (
        <>
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => markAll('PRESENT')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success/10 px-3 text-xs font-medium text-success hover:bg-success/20 transition-colors"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Mark All Present
            </button>
            <button
              onClick={() => markAll('ABSENT')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" /> Mark All Absent
            </button>
            <button
              onClick={() => markAll('LATE')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-warning/10 px-3 text-xs font-medium text-warning hover:bg-warning/20 transition-colors"
            >
              <Clock className="h-3.5 w-3.5" /> Mark All Late
            </button>
          </div>

          {/* Students List */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border bg-secondary/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {currentClassData.class.name}-{currentClassData.class.section} — {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-success">{presentCount} Present</span>
                <span className="text-destructive">{absentCount} Absent</span>
                <span className="text-warning">{lateCount} Late</span>
              </div>
            </div>
            <div className="divide-y divide-border">
              {loading && students.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : students.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">No students found in this class</div>
              ) : (
                students.map((student) => {
                  const status = attendance[student.studentId] || 'PRESENT';
                  return (
                    <div key={student.studentId} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">Roll No: {student.rollNumber}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(['PRESENT', 'ABSENT', 'LATE'] as Status[]).map((s) => {
                          const Icon = statusIcon[s];
                          return (
                            <button
                              key={s}
                              onClick={() => setStatus(student.studentId, s)}
                              className={`rounded-lg p-2 text-xs font-medium transition-colors ${status === s ? statusColor[s] : 'text-muted-foreground hover:bg-secondary'}`}
                            >
                              <Icon className="h-4 w-4" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={marking}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {marking ? (
              <>
                <Loader className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Attendance
              </>
            )}
          </button>

          {/* Past Records */}
          {recordsLoading ? (
            <div className="rounded-xl border border-border bg-card p-8 flex items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : attendanceRecords.length > 0 ? (
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Recent Attendance Records</h3>
              </div>
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {attendanceRecords.map((record) => (
                  <div key={record.date} className="px-4 py-3 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <span className="text-success">{record.present}P</span>
                        <span className="text-destructive">{record.absent}A</span>
                        <span className="text-warning">{record.late}L</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Confirm Modal */}
          <Modal
            open={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            title="Confirm Attendance"
            description="Review before submitting"
            size="sm"
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Class</span>
                  <span className="font-medium text-foreground">
                    {currentClassData.class.name}-{currentClassData.class.section}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">{selectedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Students</span>
                  <span className="font-medium text-foreground">{students.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-success">Present</span>
                  <span className="font-medium text-success">{presentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-destructive">Absent</span>
                  <span className="font-medium text-destructive">{absentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warning">Late</span>
                  <span className="font-medium text-warning">{lateCount}</span>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={marking}
                  className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={marking}
                  className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {marking ? 'Saving...' : 'Confirm & Save'}
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}

      {!selectedClassId && assignedClasses.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          <p>Select a class to mark attendance</p>
        </div>
      )}

      {assignedClasses.length === 0 && !loading && (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          <p>No classes assigned to you</p>
        </div>
      )}
    </motion.div>
  );
};

export default TeacherAttendance;
