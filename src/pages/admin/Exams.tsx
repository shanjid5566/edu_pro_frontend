import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, Calendar, Clock, FileText, X } from 'lucide-react';

const mockExams = [
  { id: '1', name: 'Mid-Term Examination', class: 'Class 10', subject: 'Mathematics', date: '2026-03-15', duration: '3 hours', totalMarks: 100, status: 'upcoming' as const },
  { id: '2', name: 'Mid-Term Examination', class: 'Class 10', subject: 'Physics', date: '2026-03-17', duration: '3 hours', totalMarks: 100, status: 'upcoming' as const },
  { id: '3', name: 'Mid-Term Examination', class: 'Class 9', subject: 'English', date: '2026-03-18', duration: '2.5 hours', totalMarks: 100, status: 'upcoming' as const },
  { id: '4', name: 'Unit Test 3', class: 'Class 10', subject: 'Chemistry', date: '2026-03-10', duration: '1.5 hours', totalMarks: 50, status: 'ongoing' as const },
  { id: '5', name: 'Unit Test 2', class: 'Class 9', subject: 'Mathematics', date: '2026-02-20', duration: '1.5 hours', totalMarks: 50, status: 'completed' as const },
  { id: '6', name: 'Unit Test 2', class: 'Class 8', subject: 'Science', date: '2026-02-18', duration: '1.5 hours', totalMarks: 50, status: 'completed' as const },
  { id: '7', name: 'Mid-Term Examination', class: 'Class 8', subject: 'History', date: '2026-03-20', duration: '2 hours', totalMarks: 100, status: 'upcoming' as const },
];

const statusStyles = {
  upcoming: 'bg-info/10 text-info',
  ongoing: 'bg-warning/10 text-warning',
  completed: 'bg-success/10 text-success',
};

const Exams = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', class: '', subject: '', date: '', duration: '', totalMarks: '' });
  const filtered = mockExams.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateExam = () => {
    if (newExam.name && newExam.class && newExam.subject && newExam.date && newExam.duration && newExam.totalMarks) {
      setShowAddModal(false);
      setNewExam({ name: '', class: '', subject: '', date: '', duration: '', totalMarks: '' });
      alert('Exam created successfully!');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exams</h1>
          <p className="text-muted-foreground">Manage examination schedules and results</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Create Exam
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exams..." className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
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
            </tr>
          </thead>
          <tbody>
            {filtered.map((exam, i) => (
              <motion.tr key={exam.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span className="font-medium text-foreground">{exam.name}</span></div>
                </td>
                <td className="px-4 py-3 text-foreground">{exam.class}</td>
                <td className="px-4 py-3 text-foreground">{exam.subject}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-foreground"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{exam.date}</div></td>
                <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-foreground"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{exam.duration}</div></td>
                <td className="px-4 py-3 text-foreground">{exam.totalMarks}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[exam.status]}`}>{exam.status}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Create Exam</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Exam Name *</label>
                <input value={newExam.name} onChange={e => setNewExam({ ...newExam, name: e.target.value })} placeholder="e.g., Mid-Term Examination" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Class *</label>
                <input value={newExam.class} onChange={e => setNewExam({ ...newExam, class: e.target.value })} placeholder="e.g., Class 10" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subject *</label>
                <input value={newExam.subject} onChange={e => setNewExam({ ...newExam, subject: e.target.value })} placeholder="e.g., Mathematics" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
                <input value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} type="date" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Duration *</label>
                <input value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: e.target.value })} placeholder="e.g., 3 hours" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Total Marks *</label>
                <input value={newExam.totalMarks} onChange={e => setNewExam({ ...newExam, totalMarks: e.target.value })} type="number" placeholder="e.g., 100" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                <button onClick={handleCreateExam} className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Create Exam</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Exams;
