import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  FileText,
  X,
  Loader,
  Download,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Modal from '@/components/ui/Modal';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchExams,
  fetchExamById,
  searchExams,
  getExamStatistics,
  getExamsByStatus,
  createExam,
  updateExam,
  deleteExam,
  exportExamsCSV,
  clearSelectedExam,
  clearSearchResults,
} from '@/store/slices/examSlice';

const statusStyles: Record<string, string> = {
  UPCOMING: 'bg-info/10 text-info',
  ONGOING: 'bg-warning/10 text-warning',
  COMPLETED: 'bg-success/10 text-success',
};

const examTypes = ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL'];

const Exams = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { exams, selectedExam, searchResults, statistics, loading, searchLoading } = useSelector(
    (state: RootState) => state.exam
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    subjectId: '',
    date: '',
    duration: '',
    totalMarks: '',
    type: 'MONTHLY',
    description: '',
  });

  // Fetch exams and statistics on mount
  useEffect(() => {
    dispatch(fetchExams({ page: 1, limit: 100 }));
    dispatch(getExamStatistics());
  }, [dispatch]);

  // Search exams when search query changes
  useEffect(() => {
    if (search.trim()) {
      dispatch(searchExams({ q: search, limit: 100 }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [search, dispatch]);

  // Filter by status
  useEffect(() => {
    if (statusFilter !== 'all') {
      dispatch(getExamsByStatus(statusFilter as 'UPCOMING' | 'ONGOING' | 'COMPLETED'));
    } else {
      dispatch(fetchExams({ page: 1, limit: 100 }));
    }
  }, [statusFilter, dispatch]);

  // Fetch exam details when viewing
  useEffect(() => {
    if (showViewModal) {
      dispatch(fetchExamById(showViewModal));
    }
  }, [showViewModal, dispatch]);

  const handleAddExam = async () => {
    if (!formData.name || !formData.classId || !formData.subjectId || !formData.date || !formData.totalMarks) {
      toast({ title: 'Error', description: 'Please fill in all required fields' });
      return;
    }

    try {
      if (editingExamId) {
        await dispatch(
          updateExam({
            id: editingExamId,
            name: formData.name,
            date: formData.date,
            duration: formData.duration,
            totalMarks: parseInt(formData.totalMarks),
            type: formData.type,
            status: statusFilter,
          })
        ).unwrap();
        toast({ title: 'Success', description: 'Exam updated successfully' });
      } else {
        await dispatch(
          createExam({
            name: formData.name,
            classId: formData.classId,
            subjectId: formData.subjectId,
            date: formData.date,
            duration: formData.duration,
            totalMarks: parseInt(formData.totalMarks),
            type: formData.type,
            description: formData.description,
          })
        ).unwrap();
        toast({ title: 'Success', description: 'Exam created successfully' });
      }
      setShowAddModal(false);
      setEditingExamId(null);
      setFormData({
        name: '',
        classId: '',
        subjectId: '',
        date: '',
        duration: '',
        totalMarks: '',
        type: 'MONTHLY',
        description: '',
      });
      dispatch(fetchExams({ page: 1, limit: 100 }));
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to save exam' });
    }
  };

  const handleDeleteExam = async (id: string, name: string) => {
    try {
      await dispatch(deleteExam(id)).unwrap();
      toast({ title: 'Success', description: `${name} deleted successfully` });
      setShowDeleteModal(null);
      dispatch(fetchExams({ page: 1, limit: 100 }));
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to delete exam' });
    }
  };

  const handleEditExam = (exam: any) => {
    setFormData({
      name: exam.name,
      classId: exam.classId,
      subjectId: exam.subjectId,
      date: exam.date.split('T')[0],
      duration: exam.duration,
      totalMarks: exam.marks?.toString() || exam.totalMarks?.toString() || '',
      type: exam.type || 'MONTHLY',
      description: '',
    });
    setEditingExamId(exam.id);
    setShowAddModal(true);
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(
        exportExamsCSV({
          search,
          status: statusFilter !== 'all' ? statusFilter : '',
        })
      ).unwrap();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exams_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast({ title: 'Success', description: 'Exams exported successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to export exams' });
    }
  };

  const filtered = searchResults.length > 0 ? searchResults : exams;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exams</h1>
          <p className="text-muted-foreground">Manage examination schedules and results</p>
        </div>
        <button
          onClick={() => {
            setEditingExamId(null);
            setFormData({
              name: '',
              classId: '',
              subjectId: '',
              date: '',
              duration: '',
              totalMarks: '',
              type: 'MONTHLY',
              description: '',
            });
            setShowAddModal(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Create Exam
        </button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-foreground">{statistics.upcoming}</p>
              </div>
              <div className="rounded-lg bg-info/10 p-3">
                <AlertCircle className="h-6 w-6 text-info" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ongoing</p>
                <p className="text-2xl font-bold text-foreground">{statistics.ongoing}</p>
              </div>
              <div className="rounded-lg bg-warning/10 p-3">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{statistics.completed}</p>
              </div>
              <div className="rounded-lg bg-success/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button
          onClick={handleExport}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Exam</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Class</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Subject</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Duration</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Marks</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && exams.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading exams...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No exams found
                </td>
              </tr>
            ) : (
              filtered.map((exam, i) => (
                <motion.tr
                  key={exam.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{exam.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {exam.class} {exam.classSection && `-${exam.classSection}`}
                  </td>
                  <td className="px-4 py-3 text-foreground">{exam.subject}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(exam.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {exam.duration}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{exam.marks || exam.totalMarks}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[exam.status] || statusStyles['UPCOMING']}`}>
                      {exam.status?.toLowerCase() || 'unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowViewModal(exam.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 text-info hover:bg-info/20 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditExam(exam)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(exam.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Exam Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingExamId(null);
        }}
        title={editingExamId ? 'Edit Exam' : 'Create Exam'}
        description={editingExamId ? 'Update exam details' : 'Enter exam information'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Exam Name *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Mid-Term Examination"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Class ID *</label>
              <input
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                placeholder="e.g., class-id"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Subject ID *</label>
              <input
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                placeholder="e.g., subject-id"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Duration *</label>
              <input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 3 hours"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Total Marks *</label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                placeholder="e.g., 100"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {examTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              className="min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingExamId(null);
              }}
              className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddExam}
              disabled={loading}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : editingExamId ? 'Update Exam' : 'Create Exam'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Exam Modal */}
      <Modal open={!!showViewModal} onClose={() => setShowViewModal(null)} title="Exam Details" size="lg">
        {selectedExam && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border p-4">
              <div>
                <p className="text-xs text-muted-foreground">Exam Name</p>
                <p className="text-sm font-medium text-foreground">{selectedExam.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Class</p>
                <p className="text-sm font-medium text-foreground">{selectedExam.class}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="text-sm font-medium text-foreground">{selectedExam.subject}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground">{new Date(selectedExam.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground">{selectedExam.duration}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Marks</p>
                <p className="text-sm font-medium text-foreground">{selectedExam.totalMarks}</p>
              </div>
            </div>

            {selectedExam.results && selectedExam.results.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Results ({selectedExam.results.length})</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedExam.results.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between rounded-lg border border-border p-2"
                    >
                      <div className="text-sm">
                        <p className="font-medium text-foreground">{result.studentName}</p>
                        <p className="text-xs text-muted-foreground">Grade: {result.grade}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{result.marksObtained}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Exam" size="sm">
        {showDeleteModal && (
          <div className="space-y-4">
            {(() => {
              const exam = exams.find((e) => e.id === showDeleteModal);
              return (
                <>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <strong className="text-foreground">{exam?.name}</strong>? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowDeleteModal(null)}
                      className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (exam) {
                          handleDeleteExam(exam.id, exam.name);
                        }
                      }}
                      disabled={loading}
                      className="h-10 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Exams;
