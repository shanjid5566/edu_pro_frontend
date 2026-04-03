import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Plus, Clock, MapPin, User, Trash2, Edit2, X, ChevronDown, Download, Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Modal from '@/components/ui/Modal';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchSchedules,
  fetchScheduleById,
  searchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getClassesDropdown,
  getTeachersDropdown,
  getSchedulesByDay,
  exportSchedulesCSV,
  clearSelectedSchedule,
  clearSearchResults,
} from '@/store/slices/classScheduleSlice';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ClassScheduleManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, selectedSchedule, searchResults, classesDropdown, teachersDropdown, loading, searchLoading } = useSelector(
    (state: RootState) => state.classSchedule
  );

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    day: 'Monday' as const,
    teacherId: '',
    startTime: '09:00',
    endTime: '10:00',
    roomNumber: '',
  });

  // Fetch schedules and dropdowns on mount
  useEffect(() => {
    dispatch(fetchSchedules({ page: 1, limit: 100 }));
    dispatch(getClassesDropdown());
    dispatch(getTeachersDropdown());
  }, [dispatch]);

  // Search schedules when search query changes
  useEffect(() => {
    if (search.trim()) {
      dispatch(searchSchedules({ q: search, limit: 100 }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [search, dispatch]);

  // Fetch schedule details when viewing for edit
  useEffect(() => {
    if (editingScheduleId) {
      dispatch(fetchScheduleById(editingScheduleId));
    }
  }, [editingScheduleId, dispatch]);

  const handleAddSchedule = async () => {
    if (!formData.classId || !formData.subjectId || !formData.teacherId || !formData.roomNumber) {
      toast({ title: 'Error', description: 'Please fill in all required fields' });
      return;
    }

    try {
      if (editingScheduleId) {
        await dispatch(updateSchedule({ id: editingScheduleId, ...formData })).unwrap();
        toast({ title: 'Success', description: 'Schedule updated successfully' });
      } else {
        await dispatch(createSchedule(formData)).unwrap();
        toast({ title: 'Success', description: 'Schedule created successfully' });
      }
      setShowAddModal(false);
      setEditingScheduleId(null);
      setFormData({ classId: '', subjectId: '', day: 'Monday', teacherId: '', startTime: '09:00', endTime: '10:00', roomNumber: '' });
      dispatch(fetchSchedules({ page: 1, limit: 100 }));
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to save schedule' });
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await dispatch(deleteSchedule(id)).unwrap();
      toast({ title: 'Success', description: 'Schedule deleted successfully' });
      dispatch(fetchSchedules({ page: 1, limit: 100 }));
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to delete schedule' });
    }
  };

  const handleEditSchedule = (schedule: any) => {
    setFormData({
      classId: schedule.classId,
      subjectId: schedule.subjectId || '',
      day: schedule.day,
      teacherId: schedule.teacherId || '',
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      roomNumber: schedule.roomNumber,
    });
    setEditingScheduleId(schedule.id);
    setShowAddModal(true);
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(
        exportSchedulesCSV({
          search,
          classId: filterClass,
          day: '',
        })
      ).unwrap();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedules_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast({ title: 'Success', description: 'Schedules exported successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to export schedules' });
    }
  };

  const filtered = searchResults.length > 0 ? searchResults : schedules;
  const displaySchedules = filtered.filter(s => !filterClass || s.classId === filterClass);

  const groupedByDay = DAYS.reduce((acc, day) => {
    acc[day] = displaySchedules.filter(s => s.day === day);
    return acc;
  }, {} as Record<string, any[]>);

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingScheduleId(null);
    setFormData({ classId: '', subjectId: '', day: 'Monday', teacherId: '', startTime: '09:00', endTime: '10:00', roomNumber: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class Schedules</h1>
          <p className="text-muted-foreground">Manage class timetables and schedules for students</p>
        </div>
        <button
          onClick={() => {
            setEditingScheduleId(null);
            setFormData({ classId: '', subjectId: '', day: 'Monday', teacherId: '', startTime: '09:00', endTime: '10:00', roomNumber: '' });
            setShowAddModal(true);
          }}
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
            onChange={(e) => setSearch(e.target.value)}
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
                {classesDropdown.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setFilterClass(cls.id);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      filterClass === cls.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {cls.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleExport}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* Timetable View */}
      <div className="space-y-6">
        {loading && schedules.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading schedules...</span>
            </div>
          </div>
        ) : (
          DAYS.map((day) => {
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
                            {schedule.className}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {schedule.className}-{schedule.classSection}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground">{schedule.subjectName}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {schedule.teacherName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          {schedule.roomNumber && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              Room {schedule.roomNumber}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
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
          })
        )}
      </div>

      {/* Add/Edit Schedule Modal */}
      <Modal
        open={showAddModal}
        onClose={handleCloseModal}
        title={editingScheduleId ? 'Edit Schedule' : 'Add Schedule'}
        description={editingScheduleId ? 'Update schedule details' : 'Enter schedule details'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Class *</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select a class</option>
                {classesDropdown.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Day *</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value as any })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Subject ID *</label>
              <input
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                placeholder="Enter subject ID"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Teacher *</label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select a teacher</option>
                {teachersDropdown.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Start Time *</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">End Time *</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Room Number *</label>
            <input
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              placeholder="e.g., 101"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleCloseModal}
              className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSchedule}
              disabled={loading}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : editingScheduleId ? 'Update Schedule' : 'Add Schedule'}
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ClassScheduleManagement;
