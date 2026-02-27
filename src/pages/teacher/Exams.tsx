import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Calendar, Save, Upload, X, CheckCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from '@/hooks/use-toast';

const exams = [
  { id: '1', name: 'Mid-Term Examination', class: '10-A', subject: 'Mathematics', date: '2026-03-15', totalMarks: 100, status: 'upcoming' },
  { id: '2', name: 'Unit Test 3', class: '10-A', subject: 'Physics', date: '2026-03-10', totalMarks: 50, status: 'ongoing' },
  { id: '3', name: 'Unit Test 2', class: '9-A', subject: 'Mathematics', date: '2026-02-20', totalMarks: 50, status: 'completed' },
  { id: '4', name: 'Half-Yearly Exam', class: '10-B', subject: 'Chemistry', date: '2026-04-01', totalMarks: 100, status: 'upcoming' },
];

const classStudentMarks: Record<string, Record<string, { id: string; name: string; rollNo: string; marks: number }[]>> = {
  '9-A': {
    'Mathematics': [
      { id: '1', name: 'Mia Robinson', rollNo: '301', marks: 45 },
      { id: '2', name: 'Aiden Lewis', rollNo: '302', marks: 38 },
      { id: '3', name: 'Charlotte Walker', rollNo: '303', marks: 48 },
      { id: '4', name: 'Lucas Hall', rollNo: '304', marks: 32 },
      { id: '5', name: 'Amelia Allen', rollNo: '305', marks: 41 },
    ],
  },
  '10-A': {
    'Mathematics': [
      { id: '6', name: 'Sarah Johnson', rollNo: '101', marks: 0 },
      { id: '7', name: 'James Williams', rollNo: '102', marks: 0 },
      { id: '8', name: 'Emma Davis', rollNo: '103', marks: 0 },
    ],
    'Physics': [
      { id: '6', name: 'Sarah Johnson', rollNo: '101', marks: 0 },
      { id: '7', name: 'James Williams', rollNo: '102', marks: 0 },
    ],
  },
};

const statusStyles: Record<string, string> = {
  upcoming: 'bg-info/10 text-info',
  ongoing: 'bg-warning/10 text-warning',
  completed: 'bg-success/10 text-success',
};

const TeacherExams = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [showMarksEntry, setShowMarksEntry] = useState(false);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showUploadQuestions, setShowUploadQuestions] = useState(false);
  const [marksClass, setMarksClass] = useState('9-A');
  const [marksSubject, setMarksSubject] = useState('Mathematics');
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [newExam, setNewExam] = useState({ name: '', class: '10-A', subject: 'Mathematics', date: '', totalMarks: '100' });

  const openMarksEntry = (exam: typeof exams[0]) => {
    setSelectedExam(exam.id);
    setMarksClass(exam.class);
    setMarksSubject(exam.subject);
    const students = classStudentMarks[exam.class]?.[exam.subject] || [];
    setMarks(Object.fromEntries(students.map(s => [s.id, s.marks])));
    setShowMarksEntry(true);
  };

  const currentStudents = classStudentMarks[marksClass]?.[marksSubject] || [];

  const handleSaveMarks = () => {
    setShowMarksEntry(false);
    toast({ title: 'Marks Saved', description: `Marks for ${marksClass} - ${marksSubject} saved successfully.` });
  };

  const handleCreateExam = () => {
    setShowCreateExam(false);
    toast({ title: 'Exam Created', description: `${newExam.name} has been created successfully.` });
    setNewExam({ name: '', class: '10-A', subject: 'Mathematics', date: '', totalMarks: '100' });
  };

  const handleUploadQuestions = () => {
    setShowUploadQuestions(false);
    toast({ title: 'Questions Submitted', description: 'Your question paper has been sent to the Admin for review.' });
    setUploadedFiles([]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exams</h1>
          <p className="text-muted-foreground">Manage exams, enter marks, and upload question papers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUploadQuestions(true)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Upload className="h-4 w-4" /> Upload Questions
          </button>
          <button onClick={() => setShowCreateExam(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Create Exam
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {exams.map((exam, i) => (
          <motion.div key={exam.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => exam.status === 'completed' && openMarksEntry(exam)}
            className={`rounded-xl border bg-card p-5 transition-shadow ${exam.status === 'completed' ? 'cursor-pointer hover:shadow-md' : ''} ${selectedExam === exam.id ? 'border-primary shadow-md' : 'border-border'}`}>
            <div className="flex items-start justify-between mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[exam.status]}`}>{exam.status}</span>
            </div>
            <h3 className="font-semibold text-foreground">{exam.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{exam.class} · {exam.subject}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" />{exam.date}</div>
            <p className="mt-1 text-xs text-muted-foreground">Total Marks: {exam.totalMarks}</p>
            {exam.status === 'completed' && (
              <button onClick={(e) => { e.stopPropagation(); openMarksEntry(exam); }} className="mt-3 w-full rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                Enter / Edit Marks
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Marks Entry Modal */}
      <Modal open={showMarksEntry} onClose={() => setShowMarksEntry(false)} title="Enter Student Marks" description={`${marksClass} — ${marksSubject}`} size="lg">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Class</label>
              <select value={marksClass} onChange={e => {
                setMarksClass(e.target.value);
                const subjects = Object.keys(classStudentMarks[e.target.value] || {});
                setMarksSubject(subjects[0] || '');
              }} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                {Object.keys(classStudentMarks).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
              <select value={marksSubject} onChange={e => {
                setMarksSubject(e.target.value);
                const students = classStudentMarks[marksClass]?.[e.target.value] || [];
                setMarks(Object.fromEntries(students.map(s => [s.id, s.marks])));
              }} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                {Object.keys(classStudentMarks[marksClass] || {}).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border">
            {currentStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{s.name.charAt(0)}</div>
                  <div><p className="text-sm font-medium text-foreground">{s.name}</p><p className="text-xs text-muted-foreground">Roll No: {s.rollNo}</p></div>
                </div>
                <input type="number" min={0} max={100} value={marks[s.id] ?? 0} onChange={e => setMarks(prev => ({ ...prev, [s.id]: Number(e.target.value) }))}
                  className="h-9 w-20 rounded-lg border border-border bg-background px-3 text-center text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
            ))}
            {currentStudents.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No students found for this class/subject combination.</div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setShowMarksEntry(false)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={handleSaveMarks} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Save className="h-4 w-4" /> Save Marks</button>
          </div>
        </div>
      </Modal>

      {/* Create Exam Modal */}
      <Modal open={showCreateExam} onClose={() => setShowCreateExam(false)} title="Create New Exam" size="md">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Exam Name</label>
            <input value={newExam.name} onChange={e => setNewExam(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mid-Term Examination" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Class</label>
              <select value={newExam.class} onChange={e => setNewExam(p => ({ ...p, class: e.target.value }))} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="10-A">10-A</option><option value="10-B">10-B</option><option value="9-A">9-A</option><option value="9-B">9-B</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
              <select value={newExam.subject} onChange={e => setNewExam(p => ({ ...p, subject: e.target.value }))} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>English</option><option>Computer Science</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Date</label>
              <input type="date" value={newExam.date} onChange={e => setNewExam(p => ({ ...p, date: e.target.value }))} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Total Marks</label>
              <input type="number" value={newExam.totalMarks} onChange={e => setNewExam(p => ({ ...p, totalMarks: e.target.value }))} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreateExam(false)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={handleCreateExam} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Create Exam</button>
          </div>
        </div>
      </Modal>

      {/* Upload Question Paper Modal */}
      <Modal open={showUploadQuestions} onClose={() => setShowUploadQuestions(false)} title="Upload Question Paper" description="Submit your question paper for Admin review" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Class</label>
              <select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option>10-A</option><option>10-B</option><option>9-A</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
              <select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                <option>Mathematics</option><option>Physics</option><option>Chemistry</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Exam</label>
            <select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option>Mid-Term Examination</option><option>Unit Test 3</option><option>Half-Yearly Exam</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Question Paper File</label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setUploadedFiles(['MidTerm_Math_Questions.pdf'])}>
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (max 10MB)</p>
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {uploadedFiles.map(f => (
                  <div key={f} className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-success"><CheckCircle className="h-4 w-4" />{f}</div>
                    <button onClick={() => setUploadedFiles([])} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Notes for Admin (optional)</label>
            <textarea rows={3} placeholder="Any additional instructions or notes..." className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowUploadQuestions(false)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={handleUploadQuestions} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Upload className="h-4 w-4" /> Submit to Admin</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default TeacherExams;
