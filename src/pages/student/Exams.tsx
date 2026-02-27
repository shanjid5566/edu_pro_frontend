import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';

const exams = [
  { id: '1', name: 'Mid-Term Examination', subject: 'Mathematics', date: '2026-03-15', time: '9:00 AM', duration: '3 hours', room: 'Hall A', totalMarks: 100, status: 'upcoming' },
  { id: '2', name: 'Mid-Term Examination', subject: 'Physics', date: '2026-03-17', time: '9:00 AM', duration: '3 hours', room: 'Lab 1', totalMarks: 100, status: 'upcoming' },
  { id: '3', name: 'Mid-Term Examination', subject: 'English', date: '2026-03-18', time: '10:00 AM', duration: '2.5 hours', room: 'Hall B', totalMarks: 100, status: 'upcoming' },
  { id: '4', name: 'Unit Test 3', subject: 'Chemistry', date: '2026-03-10', time: '11:00 AM', duration: '1.5 hours', room: 'Lab 2', totalMarks: 50, status: 'ongoing' },
];

const statusStyles: Record<string, string> = {
  upcoming: 'bg-info/10 text-info',
  ongoing: 'bg-warning/10 text-warning',
};

const StudentExams = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Exam Schedule</h1>
      <p className="text-muted-foreground">Upcoming and ongoing examinations</p>
    </div>

    <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
      <div><p className="text-sm font-medium text-foreground">Mid-Term exams start on March 15th</p><p className="text-xs text-muted-foreground">Make sure to prepare well and arrive 15 minutes early.</p></div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      {exams.map((exam, i) => (
        <motion.div key={exam.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[exam.status]}`}>{exam.status}</span>
          </div>
          <h3 className="font-semibold text-foreground">{exam.subject}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{exam.name}</p>
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /><span className="text-foreground">{exam.date}</span></div>
            <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5" /><span className="text-foreground">{exam.time} ({exam.duration})</span></div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Room: {exam.room}</span>
            <span className="text-muted-foreground">Total: {exam.totalMarks} marks</span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default StudentExams;
