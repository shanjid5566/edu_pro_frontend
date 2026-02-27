import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Save, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from '@/hooks/use-toast';

const classStudents: Record<string, { id: string; name: string; rollNo: string }[]> = {
  '10-A': [
    { id: '1', name: 'Sarah Johnson', rollNo: '101' },
    { id: '2', name: 'James Williams', rollNo: '102' },
    { id: '3', name: 'Emma Davis', rollNo: '103' },
    { id: '4', name: 'Liam Martinez', rollNo: '104' },
    { id: '5', name: 'Olivia Brown', rollNo: '105' },
    { id: '6', name: 'Noah Wilson', rollNo: '106' },
    { id: '7', name: 'Ava Taylor', rollNo: '107' },
    { id: '8', name: 'Ethan Moore', rollNo: '108' },
  ],
  '10-B': [
    { id: '9', name: 'Sophia Garcia', rollNo: '201' },
    { id: '10', name: 'Mason Lee', rollNo: '202' },
    { id: '11', name: 'Isabella Harris', rollNo: '203' },
    { id: '12', name: 'Logan Clark', rollNo: '204' },
  ],
  '9-A': [
    { id: '13', name: 'Mia Robinson', rollNo: '301' },
    { id: '14', name: 'Aiden Lewis', rollNo: '302' },
    { id: '15', name: 'Charlotte Walker', rollNo: '303' },
    { id: '16', name: 'Lucas Hall', rollNo: '304' },
    { id: '17', name: 'Amelia Allen', rollNo: '305' },
  ],
};

type Status = 'present' | 'absent' | 'late';

const statusIcon = { present: CheckCircle, absent: XCircle, late: Clock };
const statusColor = {
  present: 'text-success bg-success/10',
  absent: 'text-destructive bg-destructive/10',
  late: 'text-warning bg-warning/10',
};

const pastRecords = [
  { date: '2026-02-25', class: '10-A', present: 7, absent: 1, late: 0 },
  { date: '2026-02-24', class: '10-A', present: 6, absent: 1, late: 1 },
  { date: '2026-02-23', class: '9-A', present: 5, absent: 0, late: 0 },
  { date: '2026-02-20', class: '10-B', present: 3, absent: 1, late: 0 },
];

const TeacherAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const students = classStudents[selectedClass] || [];
  const [attendance, setAttendance] = useState<Record<string, Status>>(
    Object.fromEntries(students.map(s => [s.id, 'present' as Status]))
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    const newStudents = classStudents[cls] || [];
    setAttendance(Object.fromEntries(newStudents.map(s => [s.id, 'present' as Status])));
  };

  const setStatus = (id: string, status: Status) => setAttendance(prev => ({ ...prev, [id]: status }));

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendance).filter(v => v === 'late').length;

  const handleSave = () => {
    setShowConfirmModal(false);
    toast({ title: 'Attendance Saved', description: `Attendance for ${selectedClass} on ${selectedDate} has been saved successfully.` });
  };

  const markAll = (status: Status) => {
    setAttendance(Object.fromEntries(students.map(s => [s.id, status])));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
          <p className="text-muted-foreground">Record student attendance for your classes</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <select value={selectedClass} onChange={e => handleClassChange(e.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
            {Object.keys(classStudents).map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => markAll('present')} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success/10 px-3 text-xs font-medium text-success hover:bg-success/20 transition-colors">
          <CheckCircle className="h-3.5 w-3.5" /> Mark All Present
        </button>
        <button onClick={() => markAll('absent')} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors">
          <XCircle className="h-3.5 w-3.5" /> Mark All Absent
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-secondary/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">{selectedClass} — {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="text-success">{presentCount} Present</span>
            <span className="text-destructive">{absentCount} Absent</span>
            <span className="text-warning">{lateCount} Late</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {students.map(student => {
            const status = attendance[student.id] || 'present';
            return (
              <div key={student.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{student.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Roll No: {student.rollNo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['present', 'absent', 'late'] as Status[]).map(s => {
                    const Icon = statusIcon[s];
                    return (
                      <button key={s} onClick={() => setStatus(student.id, s)} className={`rounded-lg p-2 text-xs font-medium transition-colors ${status === s ? statusColor[s] : 'text-muted-foreground hover:bg-secondary'}`}>
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => setShowConfirmModal(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        <Save className="h-4 w-4" /> Save Attendance
      </button>

      {/* Past Records */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Attendance Records</h3>
        </div>
        <div className="divide-y divide-border">
          {pastRecords.map(r => (
            <div key={r.date + r.class} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Class {r.class}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-success">{r.present}P</span>
                <span className="text-destructive">{r.absent}A</span>
                <span className="text-warning">{r.late}L</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Confirm Attendance" description="Review before submitting" size="sm">
        <div className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Class</span><span className="font-medium text-foreground">{selectedClass}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-medium text-foreground">{selectedDate}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Students</span><span className="font-medium text-foreground">{students.length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-success">Present</span><span className="font-medium text-success">{presentCount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-destructive">Absent</span><span className="font-medium text-destructive">{absentCount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-warning">Late</span><span className="font-medium text-warning">{lateCount}</span></div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowConfirmModal(false)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={handleSave} className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Confirm & Save</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default TeacherAttendance;
