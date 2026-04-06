import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, MapPin, Loader } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchTeacherClassById,
  fetchTeacherClassStatistics,
  fetchTeacherClasses,
} from '@/store/slices/teacherClassesSlice';
import { useToast } from '@/components/ui/use-toast';
import Modal from '@/components/ui/Modal';

const TeacherClasses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { assignedClasses, todaySchedule, selectedClass, selectedClassStatistics, loading, detailLoading } =
    useSelector((state: RootState) => state.teacherClasses);
  const [showClassModal, setShowClassModal] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        await dispatch(fetchTeacherClasses()).unwrap();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error || 'Failed to load teacher classes',
          variant: 'destructive',
        });
      }
    };

    loadClasses();
  }, [dispatch, toast]);

  const handleClassClick = async (classId: string) => {
    try {
      await Promise.all([
        dispatch(fetchTeacherClassById(classId)).unwrap(),
        dispatch(fetchTeacherClassStatistics(classId)).unwrap(),
      ]);
      setShowClassModal(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to load class details',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
        <p className="text-muted-foreground">View your assigned classes and today's schedule</p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Assigned Classes</h2>
        {loading && assignedClasses.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {assignedClasses.map((cls, i) => (
              <motion.button
                key={cls.classId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleClassClick(cls.classId)}
                className="rounded-xl border border-border bg-card p-5 text-left hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-foreground">{cls.className}</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-foreground">Click to view details</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-foreground">{cls.studentCount} students</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Today's Schedule</h2>
        <div className="space-y-3">
          {todaySchedule.map((item, i) => (
            <motion.div
              key={item.scheduleId || `${item.classId}-${item.time}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex h-12 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10">
                <Clock className="mb-0.5 h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-medium text-primary">{item.time.split(' - ')[0]}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.subject}</p>
                <p className="text-xs text-muted-foreground">{item.className}</p>
              </div>
              <div className="hidden items-center gap-4 text-sm sm:flex">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Room {item.room}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {item.studentCount}
                </div>
              </div>
            </motion.div>
          ))}
          {todaySchedule.length === 0 && !loading && (
            <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
              No classes scheduled for today
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showClassModal} onClose={() => setShowClassModal(false)} title="Class Details">
        {detailLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedClass ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {selectedClass.name}-{selectedClass.section}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedClass.students.length} / {selectedClass.capacity} students enrolled
              </p>
            </div>

            {selectedClassStatistics && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Attendance</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedClassStatistics.attendance.percentage}%
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Performance</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedClassStatistics.performance.averagePercentage}%
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Students</p>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedClass.students.map((student) => (
                  <div key={student.id} className="rounded-md border border-border px-3 py-2 text-sm">
                    <p className="font-medium text-foreground">{student.user.name}</p>
                    <p className="text-xs text-muted-foreground">{student.user.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No class selected</p>
        )}
      </Modal>
    </motion.div>
  );
};

export default TeacherClasses;
