import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Award, BookOpen, Target, Users, Loader, AlertCircle, BarChart3 } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchStudentResults,
  fetchResultsSummary,
  fetchSubjectPerformance,
  fetchClassComparison,
  fetchResultsTrend,
  fetchResultsBySubject,
  clearError,
  ResultDetail,
  SubjectPerformance,
  TrendData,
} from '@/store/slices/studentResultsSlice';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const gradeColors: Record<string, string> = {
  'A+': 'text-green-600',
  'A': 'text-green-500',
  'B+': 'text-blue-600',
  'B': 'text-blue-500',
  'C+': 'text-yellow-600',
  'C': 'text-yellow-500',
  'D': 'text-orange-500',
  'F': 'text-red-500',
};

const gradeBgColors: Record<string, string> = {
  'A+': 'bg-green-100',
  'A': 'bg-green-50',
  'B+': 'bg-blue-100',
  'B': 'bg-blue-50',
  'C+': 'bg-yellow-100',
  'C': 'bg-yellow-50',
  'D': 'bg-orange-100',
  'F': 'bg-red-100',
};

const StudentResults = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { allResults, summary, subjectPerformance, classComparison, trendData, loading, error } = useSelector(
    (state: RootState) => state.studentResults,
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'trend'>('overview');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ResultDetail | null>(null);

  // Initialize - fetch all data
  useEffect(() => {
    const loadResults = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudentResults()).unwrap(),
          dispatch(fetchResultsSummary()).unwrap(),
          dispatch(fetchSubjectPerformance()).unwrap(),
          dispatch(fetchClassComparison()).unwrap(),
          dispatch(fetchResultsTrend(6)).unwrap(),
        ]);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err || 'Failed to load results',
          variant: 'destructive',
        });
      }
    };

    loadResults();
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

  const handleResultClick = (result: ResultDetail) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  const handleSubjectClick = (subject: SubjectPerformance) => {
    dispatch(fetchResultsBySubject(subject.subjectId));
  };

  if (loading && !summary) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Results</h1>
        <p className="text-muted-foreground">Your exam results and performance analytics</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="text-2xl font-bold text-foreground">{summary.totalExams}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary opacity-50" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-2xl font-bold text-foreground">{summary.averagePercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">{summary.averageGrade}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-info opacity-50" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest</p>
                <p className="text-2xl font-bold text-success">{summary.highestPercentage}%</p>
              </div>
              <Award className="h-8 w-8 text-success opacity-50" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lowest</p>
                <p className="text-2xl font-bold text-warning">{summary.lowestPercentage}%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Class Comparison */}
      {classComparison && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Class Comparison</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Performance</p>
              <p className="text-2xl font-bold text-primary">{classComparison.studentPercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Class Average</p>
              <p className="text-2xl font-bold text-foreground">{classComparison.classAverage}%</p>
              <p className="text-xs text-success mt-1">+{classComparison.difference}% above average</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Rank</p>
              <p className="text-2xl font-bold text-foreground">{classComparison.studentRank}/{classComparison.totalStudents}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Percentile Rank</p>
              <p className="text-2xl font-bold text-success">{classComparison.percentileRank}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(['overview', 'subjects', 'trend'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab - All Results */}
      {activeTab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {allResults.length > 0 ? (
            allResults.map((result, i) => (
              <motion.button
                key={result.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleResultClick(result)}
                className={`rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all text-left hover:bg-secondary/50`}
              >
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${gradeColors[result.grade]} ${gradeBgColors[result.grade]}`}>
                    {result.grade}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">{result.subject}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{result.examName}</p>
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Marks</span>
                    <span className="font-bold text-foreground">{result.marksObtained}/{result.totalMarks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Percentage</span>
                    <span className={`font-bold ${result.percentage >= 80 ? 'text-success' : result.percentage >= 60 ? 'text-info' : 'text-warning'}`}>
                      {result.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-xs font-medium text-foreground">{result.type.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                <div className="mt-3 w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      result.percentage >= 80
                        ? 'bg-success'
                        : result.percentage >= 60
                          ? 'bg-info'
                          : 'bg-warning'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </motion.button>
            ))
          ) : (
            <div className="col-span-2 rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-1">No results yet</p>
              <p className="text-sm">Your exam results will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Subjects Tab - Subject Performance */}
      {activeTab === 'subjects' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {subjectPerformance.length > 0 ? (
            subjectPerformance.map((subject, i) => (
              <motion.button
                key={subject.subjectId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSubjectClick(subject)}
                className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all text-left hover:bg-secondary/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${gradeColors[subject.grade]} ${gradeBgColors[subject.grade]}`}>
                    {subject.grade}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">{subject.subject}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{subject.totalExams} exam{subject.totalExams !== 1 ? 's' : ''}</p>
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average</span>
                    <span className={`font-bold ${subject.averagePercentage >= 80 ? 'text-success' : subject.averagePercentage >= 60 ? 'text-info' : 'text-warning'}`}>
                      {subject.averagePercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Score</span>
                    <span className="font-bold text-foreground">{subject.marksObtained}/{subject.totalMarks}</span>
                  </div>
                </div>
                <div className="mt-3 w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      subject.averagePercentage >= 80
                        ? 'bg-success'
                        : subject.averagePercentage >= 60
                          ? 'bg-info'
                          : 'bg-warning'
                    }`}
                    style={{ width: `${subject.averagePercentage}%` }}
                  />
                </div>
              </motion.button>
            ))
          ) : (
            <div className="col-span-2 rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-1">No subject performance data</p>
              <p className="text-sm">Subject-wise analysis will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Trend Tab - Chart */}
      {activeTab === 'trend' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Performance Trend (Last 6 Months)</h2>
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="examName"
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '0.75rem' }}
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
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    color: 'var(--color-muted-foreground)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Score %"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No trend data available</p>
            </div>
          )}
        </div>
      )}

      {/* Result Detail Modal */}
      <Modal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Result Details"
        size="lg"
      >
        {selectedResult ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">Exam</p>
                  <p className="font-semibold text-foreground">{selectedResult.examName}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${gradeColors[selectedResult.grade]} ${gradeBgColors[selectedResult.grade]}`}>
                  {selectedResult.grade}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Subject</p>
                  <p className="font-medium text-foreground">{selectedResult.subject}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Class</p>
                  <p className="font-medium text-foreground">{selectedResult.class}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Exam Type</p>
                  <p className="font-medium text-foreground">{selectedResult.type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedResult.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-success/10 border border-success/20 p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Performance</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Marks</p>
                  <p className="text-2xl font-bold text-foreground">{selectedResult.marksObtained}</p>
                  <p className="text-xs text-muted-foreground">/{selectedResult.totalMarks}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Percentage</p>
                  <p className="text-2xl font-bold text-success">{selectedResult.percentage}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Grade</p>
                  <p className={`text-2xl font-bold ${gradeColors[selectedResult.grade]}`}>{selectedResult.grade}</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden mt-2">
                <div
                  className="h-full bg-success transition-all"
                  style={{ width: `${selectedResult.percentage}%` }}
                />
              </div>
            </div>

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

export default StudentResults;
