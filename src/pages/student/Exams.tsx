import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, AlertCircle, Loader, Award, TrendingUp } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchStudentExams,
  fetchExamResults,
  fetchExamStatistics,
  fetchExamDetail,
  clearError,
  Exam,
  ExamResult,
} from '@/store/slices/studentExamsSlice';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/use-toast';

const statusStyles: Record<string, { bg: string; text: string }> = {
  UPCOMING: { bg: 'bg-info/10', text: 'text-info' },
  ONGOING: { bg: 'bg-warning/10', text: 'text-warning' },
  COMPLETED: { bg: 'bg-success/10', text: 'text-success' },
};

const typeColors: Record<string, string> = {
  HALF_YEARLY: 'bg-purple-100 text-purple-700',
  QUARTERLY: 'bg-blue-100 text-blue-700',
  MONTHLY: 'bg-green-100 text-green-700',
  UNIT_TEST: 'bg-orange-100 text-orange-700',
};

const StudentExams = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { allExams, results, statistics, selectedExam, loading, error } = useSelector(
    (state: RootState) => state.studentExams,
  );

  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Initialize - fetch all exams, results, and statistics
  useEffect(() => {
    const loadExams = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudentExams()).unwrap(),
          dispatch(fetchExamResults()).unwrap(),
          dispatch(fetchExamStatistics()).unwrap(),
        ]);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err || 'Failed to load exams',
          variant: 'destructive',
        });
      }
    };

    loadExams();
  }, [dispatch, toast]);

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

  const handleExamClick = (exam: Exam) => {
    dispatch(fetchExamDetail(exam.id));
    setShowDetailModal(true);
  };

  const getDisplayExams = (): Exam[] => {
    if (!allExams) return [];
    return allExams[activeTab] || [];
  };

  const displayExams = getDisplayExams();

  const getResultForExam = (examId: string): ExamResult | undefined => {
    return results.find((r) => r.examId === examId);
  };

  if (loading && !allExams) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exam Schedule</h1>
        <p className="text-muted-foreground">Upcoming and ongoing examinations</p>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="text-2xl font-bold text-foreground">{statistics.totalExams}</p>
              </div>
              <FileText className="h-8 w-8 text-primary opacity-50" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Percentage</p>
                <p className="text-2xl font-bold text-foreground">{statistics.averagePercentage}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-info opacity-50" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest</p>
                <p className="text-2xl font-bold text-foreground">{statistics.highestPercentage}%</p>
              </div>
              <Award className="h-8 w-8 text-success opacity-50" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lowest</p>
                <p className="text-2xl font-bold text-foreground">{statistics.lowestPercentage}%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Alert for upcoming exams */}
      {allExams && (allExams.upcoming.length > 0 || allExams.ongoing.length > 0) && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {allExams.ongoing.length > 0 ? `${allExams.ongoing.length} exam ongoing` : `${allExams.upcoming.length} upcoming exam${allExams.upcoming.length !== 1 ? 's' : ''}`}
            </p>
            <p className="text-xs text-muted-foreground">Make sure to prepare well and arrive 15 minutes early.</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(['upcoming', 'ongoing', 'completed'] as const).map((tab) => {
          const count =
            tab === 'upcoming'
              ? allExams?.summary.upcomingCount ?? 0
              : tab === 'ongoing'
                ? allExams?.summary.ongoingCount ?? 0
                : allExams?.summary.completedCount ?? 0;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Exams List */}
      {displayExams.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {displayExams.map((exam, i) => {
            const examResult = getResultForExam(exam.id);
            const statusStyle = statusStyles[exam.status];

            return (
              <motion.button
                key={exam.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleExamClick(exam)}
                className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all text-left hover:bg-secondary/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex gap-2 flex-wrap justify-end">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {exam.status.charAt(0) + exam.status.slice(1).toLowerCase()}
                    </span>
                    {exam.type && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[exam.type] || 'bg-gray-100 text-gray-700'}`}>
                        {exam.type.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">{exam.subject}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{exam.name}</p>
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-foreground">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-foreground">{exam.time}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total: {exam.totalMarks} marks</span>
                  {examResult && <span className="font-medium text-success">Scored: {examResult.marksObtained}/{examResult.totalMarks}</span>}
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-1">No {activeTab} exams</p>
          <p className="text-sm">Check back later for updates</p>
        </div>
      )}

      {/* Exam Detail Modal */}
      <Modal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedExam?.name || 'Exam Details'}
        size="lg"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedExam ? (
          <div className="space-y-4">
            {/* Exam Info */}
            <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject</span>
                <span className="font-medium text-foreground">{selectedExam.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class</span>
                <span className="font-medium text-foreground">{selectedExam.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {new Date(selectedExam.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">{selectedExam.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Marks</span>
                <span className="font-medium text-foreground">{selectedExam.totalMarks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className={`font-medium px-2 py-1 rounded text-xs ${typeColors[selectedExam.type] || 'bg-gray-100 text-gray-700'}`}>
                  {selectedExam.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${selectedExam.status === 'COMPLETED' ? 'text-success' : selectedExam.status === 'ONGOING' ? 'text-warning' : 'text-info'}`}>
                  {selectedExam.status}
                </span>
              </div>
            </div>

            {/* Result if completed */}
            {selectedExam.result && (
              <div className="rounded-lg bg-success/10 p-4 space-y-2 border border-success/20">
                <h4 className="font-semibold text-foreground">Result</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Marks</p>
                    <p className="text-lg font-bold text-success">{selectedExam.result.marksObtained}/{selectedExam.result.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Percentage</p>
                    <p className="text-lg font-bold text-success">{selectedExam.result.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className="text-lg font-bold text-success">{selectedExam.result.grade}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetailModal(false)}
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

export default StudentExams;
