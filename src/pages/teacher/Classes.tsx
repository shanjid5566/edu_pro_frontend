import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, MapPin } from 'lucide-react';

const schedule = [
  { id: '1', class: '10-A', subject: 'Mathematics', time: '8:00 - 8:45', room: 'Room 201', students: 35 },
  { id: '2', class: '10-B', subject: 'Mathematics', time: '9:00 - 9:45', room: 'Room 203', students: 32 },
  { id: '3', class: '9-A', subject: 'Physics', time: '10:00 - 10:45', room: 'Lab 1', students: 38 },
  { id: '4', class: '10-A', subject: 'Physics', time: '11:00 - 11:45', room: 'Lab 1', students: 35 },
  { id: '5', class: '9-A', subject: 'Mathematics', time: '1:00 - 1:45', room: 'Room 201', students: 38 },
];

const assignedClasses = [
  { class: '10-A', subjects: ['Mathematics', 'Physics'], students: 35 },
  { class: '10-B', subjects: ['Mathematics'], students: 32 },
  { class: '9-A', subjects: ['Mathematics', 'Physics'], students: 38 },
];

const TeacherClasses = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
      <p className="text-muted-foreground">View your assigned classes and today's schedule</p>
    </div>

    <div>
      <h2 className="mb-3 text-lg font-semibold text-foreground">Assigned Classes</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {assignedClasses.map((cls, i) => (
          <motion.div key={cls.class} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-foreground">{cls.class}</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><BookOpen className="h-4 w-4" /><span className="text-foreground">{cls.subjects.join(', ')}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /><span className="text-foreground">{cls.students} students</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div>
      <h2 className="mb-3 text-lg font-semibold text-foreground">Today's Schedule</h2>
      <div className="space-y-3">
        {schedule.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
            <div className="flex h-12 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10">
              <Clock className="mb-0.5 h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-medium text-primary">{item.time.split(' - ')[0]}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{item.subject}</p>
              <p className="text-xs text-muted-foreground">{item.class}</p>
            </div>
            <div className="hidden items-center gap-4 text-sm sm:flex">
              <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{item.room}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" />{item.students}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default TeacherClasses;
