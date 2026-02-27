import { motion } from 'framer-motion';
import { Clock, MapPin, Users, BookOpen } from 'lucide-react';

const routine = [
  { day: 'Monday', classes: [
    { time: '8:00 - 8:45', subject: 'Mathematics', teacher: 'Emily Carter', room: '201' },
    { time: '9:00 - 9:45', subject: 'Physics', teacher: 'Emily Carter', room: 'Lab 1' },
    { time: '10:00 - 10:45', subject: 'English', teacher: 'David Park', room: '201' },
    { time: '11:00 - 11:45', subject: 'Chemistry', teacher: 'Rachel Kim', room: 'Lab 2' },
    { time: '1:00 - 1:45', subject: 'Computer Science', teacher: 'Lisa Anderson', room: 'CS Lab' },
  ]},
  { day: 'Tuesday', classes: [
    { time: '8:00 - 8:45', subject: 'English', teacher: 'David Park', room: '201' },
    { time: '9:00 - 9:45', subject: 'Mathematics', teacher: 'Emily Carter', room: '201' },
    { time: '10:00 - 10:45', subject: 'History', teacher: 'Michael Chen', room: '301' },
    { time: '11:00 - 11:45', subject: 'Physics', teacher: 'Emily Carter', room: 'Lab 1' },
    { time: '1:00 - 1:45', subject: 'PE', teacher: 'James Wright', room: 'Ground' },
  ]},
  { day: 'Wednesday', classes: [
    { time: '8:00 - 8:45', subject: 'Chemistry', teacher: 'Rachel Kim', room: 'Lab 2' },
    { time: '9:00 - 9:45', subject: 'Computer Science', teacher: 'Lisa Anderson', room: 'CS Lab' },
    { time: '10:00 - 10:45', subject: 'Mathematics', teacher: 'Emily Carter', room: '201' },
    { time: '11:00 - 11:45', subject: 'English', teacher: 'David Park', room: '201' },
  ]},
];

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-primary/10 text-primary border-primary/20',
  Physics: 'bg-accent/10 text-accent border-accent/20',
  English: 'bg-info/10 text-info border-info/20',
  Chemistry: 'bg-warning/10 text-warning border-warning/20',
  'Computer Science': 'bg-success/10 text-success border-success/20',
  History: 'bg-destructive/10 text-destructive border-destructive/20',
  PE: 'bg-secondary text-secondary-foreground border-border',
};

const StudentClasses = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
      <p className="text-muted-foreground">Your weekly class routine and schedule</p>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {['Mathematics', 'Physics', 'English', 'Chemistry', 'Computer Science', 'History'].map(subject => (
        <div key={subject} className={`rounded-lg border p-3 ${subjectColors[subject] || 'bg-secondary text-secondary-foreground border-border'}`}>
          <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span className="text-sm font-medium">{subject}</span></div>
        </div>
      ))}
    </div>

    <div className="space-y-6">
      {routine.map(day => (
        <div key={day.day}>
          <h2 className="mb-3 text-lg font-semibold text-foreground">{day.day}</h2>
          <div className="space-y-2">
            {day.classes.map((cls, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm ${subjectColors[cls.subject] || 'bg-card border-border'}`}>
                <div className="flex h-12 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-card/80">
                  <Clock className="mb-0.5 h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium">{cls.time.split(' - ')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{cls.subject}</p>
                  <p className="text-xs opacity-75">{cls.teacher}</p>
                </div>
                <div className="hidden items-center gap-1.5 text-xs sm:flex"><MapPin className="h-3.5 w-3.5" />{cls.room}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default StudentClasses;
