import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Clock, MapPin, User, Trash2, Edit2, X, ChevronDown } from 'lucide-react';
import { mockClassSchedules } from '@/services/mockData';
import { ClassSchedule } from '@/types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TEACHERS = ['Emily Carter', 'David Park', 'Rachel Kim', 'Michael Chen', 'Lisa Anderson', 'James Wright', 'Sarah Lee'];
const mockClasses = [
  { id: '1', name: 'Class 10', section: 'A' },
  { id: '2', name: 'Class 10', section: 'B' },
  { id: '3', name: 'Class 9', section: 'A' },
  { id: '4', name: 'Class 9', section: 'B' },
  { id: '5', name: 'Class 8', section: 'A' },
  { id: '6', name: 'Class 8', section: 'B' },
  { id: '7', name: 'Class 7', section: 'A' },
];

const ClassScheduleManagement = () => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>(mockClassSchedules);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [newSchedule, setNewSchedule] = useState<{
    classId: string;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
    room: string;
  }>({
    classId: '',
    day: 'Monday',
    subject: '',
    teacher: '',
    startTime: '09:00',
    endTime: '10:00',
    room: '',
  });

  const filtered = schedules.filter(schedule => {
    const matchesSearch = schedule.subject.toLowerCase().includes(search.toLowerCase()) || 
                         schedule.teacher.toLowerCase().includes(search.toLowerCase()) ||
                         schedule.room?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = !filterClass || `${schedule.className}-${schedule.classSection}` === filterClass;
    return matchesSearch && matchesClass;
  });

  const groupedByDay = DAYS.reduce((acc, day) => {
    acc[day] = filtered.filter(s => s.day === day);
    return acc;
  }, {} as Record<string, ClassSchedule[]>);

  const handleAddSchedule = () => {
    const selectedClass = mockClasses.find(c => c.id === newSchedule.classId);
    if (selectedClass && newSchedule.subject && newSchedule.teacher && newSchedule.startTime && newSchedule.endTime) {
      const schedule: ClassSchedule = {
        id: `schedule_${Date.now()}`,
        classId: newSchedule.classId,
        className: selectedClass.name,
        classSection: selectedClass.section,
        day: newSchedule.day,
        subject: newSchedule.subject,
        teacher: newSchedule.teacher,
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime,
        room: newSchedule.room,
      };
      
      if (editingId) {
        setSchedules(schedules.map(s => s.id === editingId ? { ...schedule, id: editingId } : s));
        setEditingId(null);
      } else {
        setSchedules([...schedules, schedule]);
      }
      
      setShowAddModal(false);
      setNewSchedule({
        classId: '',
        day: 'Monday',
        subject: '',
        teacher: '',
        startTime: '09:00',
        endTime: '10:00',
        room: '',
      });
    }
  };

  const handleEdit = (schedule: ClassSchedule) => {
    setNewSchedule({
      classId: schedule.classId,
      day: schedule.day,
      subject: schedule.subject,
      teacher: schedule.teacher,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      room: schedule.room || '',
    });
    setEditingId(schedule.id);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setNewSchedule({
      classId: '',
      day: 'Monday',
      subject: '',
      teacher: '',
      startTime: '09:00',
      endTime: '10:00',
      room: '',
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class Schedules</h1>
          <p className="text-muted-foreground">Manage class timetables and schedules for students</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Schedule
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search by subject, teacher, or room..." 
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Filter by Class
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-10">
              <div className="p-2">
                <button
                  onClick={() => {
                    setFilterClass('');
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    !filterClass ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  All Classes
                </button>
                {mockClasses.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setFilterClass(`${cls.name}-${cls.section}`);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      filterClass === `${cls.name}-${cls.section}` 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {cls.name}-{cls.section}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timetable View */}
      <div className="space-y-6">
        {DAYS.map((day) => {
          const daySchedules = groupedByDay[day];
          return (
            <motion.div 
              key={day} 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="mb-4 text-lg font-semibold text-foreground">{day}</h3>
              {daySchedules.length > 0 ? (
                <div className="space-y-3">
                  {daySchedules.map((schedule) => (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-4 rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-semibold text-primary">
                            {schedule.className.split(' ')[1]}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {schedule.className}-{schedule.classSection}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground">{schedule.subject}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {schedule.teacher}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          {schedule.room && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              Room {schedule.room}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-secondary/50 p-4 text-center text-sm text-muted-foreground">
                  No schedules for {day}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {editingId ? 'Edit Schedule' : 'Add Schedule'}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Class *</label>
                <select 
                  value={newSchedule.classId} 
                  onChange={e => setNewSchedule({ ...newSchedule, classId: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a class</option>
                  {mockClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}-{cls.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Day *</label>
                <select 
                  value={newSchedule.day} 
                  onChange={e => setNewSchedule({ ...newSchedule, day: e.target.value as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' })}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subject *</label>
                <input 
                  value={newSchedule.subject} 
                  onChange={e => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                  placeholder="e.g., Mathematics" 
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Teacher *</label>
                <select 
                  value={newSchedule.teacher} 
                  onChange={e => setNewSchedule({ ...newSchedule, teacher: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a teacher</option>
                  {TEACHERS.map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Start Time *</label>
                  <input 
                    type="time"
                    value={newSchedule.startTime} 
                    onChange={e => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">End Time *</label>
                  <input 
                    type="time"
                    value={newSchedule.endTime} 
                    onChange={e => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Room Number</label>
                <input 
                  value={newSchedule.room} 
                  onChange={e => setNewSchedule({ ...newSchedule, room: e.target.value })}
                  placeholder="e.g., 101" 
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSchedule}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {editingId ? 'Update' : 'Add'} Schedule
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ClassScheduleManagement;
