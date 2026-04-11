import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, BookOpen, Loader, ChevronDown } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchStudentClasses,
  fetchTimetable,
  fetchSubjectDetail,
  fetchDaySchedule,
} from '@/store/slices/studentClassesSlice';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/use-toast';

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-primary/10 text-primary border-primary/20',
  Science: 'bg-accent/10 text-accent border-accent/20',
  English: 'bg-info/10 text-info border-info/20',
  Chemistry: 'bg-warning/10 text-warning border-warning/20',
  'Computer Science': 'bg-success/10 text-success border-success/20',
  History: 'bg-destructive/10 text-destructive border-destructive/20',
  Geography: 'bg-violet-100 text-violet-700 border-violet-200',
  Physics: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  PE: 'bg-secondary text-secondary-foreground border-border',
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StudentClasses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { classInfo, timetable, selectedSubjectDetail, loading, error } = useSelector(
    (state: RootState) => state.studentClasses,
  );

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);

  // Initialize - fetch class info and timetable
  useEffect(() => {
    dispatch(fetchStudentClasses());
    dispatch(fetchTimetable());
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

  const handleSubjectClick = (subjectId: string) => {
    dispatch(fetchSubjectDetail(subjectId));
    setShowSubjectModal(true);
  };

  const getDaySchedule = () => {
    return timetable?.[selectedDay] || [];
  };

  const schedule = getDaySchedule();

  if (loading && !classInfo) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
        <p className="text-muted-foreground">Your weekly class routine and schedule</p>
      </div>

      {/* Class Info */}
      {classInfo && (
        <div className="rounded-xl border border-border bg-card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Class {classInfo.class.name}-{classInfo.class.section}
              </h2>
              <p className="text-sm text-muted-foreground">{classInfo.totalSubjects} subjects</p>
            </div>
            <Users className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>
      )}

      {/* Subjects Grid */}
      {classInfo && classInfo.subjects.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">My Subjects</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classInfo.subjects.map((subject) => (
              <motion.button
                key={subject.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleSubjectClick(subject.id)}
                className={`rounded-lg border p-3 text-left transition-shadow hover:shadow-md ${subjectColors[subject.name] || 'bg-secondary text-secondary-foreground border-border'}`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">{subject.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Day Selector */}
      <div className="flex gap-2 items-center">
        <h3 className="text-sm font-semibold text-foreground">Select Day:</h3>
        <div className="relative">
          <button
            onClick={() => setDayDropdownOpen(!dayDropdownOpen)}
            className="h-10 px-4 rounded-lg border border-border bg-card text-foreground flex items-center gap-2 hover:bg-secondary transition-colors"
          >
            {selectedDay}
            <ChevronDown className={`h-4 w-4 transition-transform ${dayDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dayDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setDayDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-secondary transition-colors ${selectedDay === day ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timetable */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{selectedDay}'s Schedule</h3>
        {schedule && schedule.length > 0 ? (
          <div className="space-y-3">
            {schedule.map((cls, i) => (
              <motion.div
                key={cls.scheduleId || i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-md ${subjectColors[cls.subject] || 'bg-card border-border'}`}
              >
                <div className="flex h-12 w-24 shrink-0 flex-col items-center justify-center rounded-lg bg-card/80">
                  <Clock className="mb-0.5 h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium">{cls.startTime || cls.time.split(' - ')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{cls.subject}</p>
                  <p className="text-xs opacity-75">{cls.teacher}</p>
                </div>
                <div className="hidden items-center gap-1.5 text-xs sm:flex">
                  <MapPin className="h-3.5 w-3.5" />
                  {cls.room}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No classes scheduled for {selectedDay}</p>
          </div>
        )}
      </div>

      {/* Subject Detail Modal */}
      <Modal
        open={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        title={selectedSubjectDetail?.name || 'Subject Details'}
        size="lg"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedSubjectDetail ? (
          <div className="space-y-6">
            {/* Teachers */}
            {selectedSubjectDetail.teachers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Teachers</h4>
                <div className="space-y-2">
                  {selectedSubjectDetail.teachers.map((teacher) => (
                    <div key={teacher.id} className="rounded-lg bg-secondary/50 p-3">
                      <p className="font-medium text-foreground">{teacher.name}</p>
                      {teacher.email && <p className="text-xs text-muted-foreground">{teacher.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exams */}
            {(selectedSubjectDetail.upcomingExams.length > 0 ||
              selectedSubjectDetail.ongoingExams.length > 0 ||
              selectedSubjectDetail.completedExams.length > 0) && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Exams</h4>
                <div className="space-y-3">
                  {selectedSubjectDetail.upcomingExams.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-warning mb-2">Upcoming</p>
                      {selectedSubjectDetail.upcomingExams.map((exam) => (
                        <div key={exam.id} className="rounded-lg bg-warning/10 p-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{exam.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(exam.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSubjectDetail.ongoingExams.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-info mb-2">Ongoing</p>
                      {selectedSubjectDetail.ongoingExams.map((exam) => (
                        <div key={exam.id} className="rounded-lg bg-info/10 p-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{exam.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(exam.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSubjectDetail.completedExams.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-success mb-2">Completed</p>
                      {selectedSubjectDetail.completedExams.map((exam) => (
                        <div key={exam.id} className="rounded-lg bg-success/10 p-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{exam.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(exam.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedSubjectDetail.upcomingExams.length === 0 &&
              selectedSubjectDetail.ongoingExams.length === 0 &&
              selectedSubjectDetail.completedExams.length === 0 && (
                <div className="text-center text-sm text-muted-foreground">No exams for this subject</div>
              )}

            <button
              onClick={() => setShowSubjectModal(false)}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        ) : null}
      </Modal>
    </motion.div>
  );
};

export default StudentClasses;
