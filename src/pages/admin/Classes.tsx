import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Users, BookOpen, UserCheck, X } from 'lucide-react';

const mockClasses = [
  { id: '1', name: 'Class 10', section: 'A', classTeacher: 'Emily Carter', totalStudents: 35, capacity: 40, subjects: ['Math', 'Physics', 'Chemistry', 'English', 'CS'] },
  { id: '2', name: 'Class 10', section: 'B', classTeacher: 'Lisa Anderson', totalStudents: 32, capacity: 40, subjects: ['Math', 'Physics', 'Chemistry', 'English', 'CS'] },
  { id: '3', name: 'Class 9', section: 'A', classTeacher: 'David Park', totalStudents: 38, capacity: 40, subjects: ['Math', 'Science', 'English', 'History', 'Geography'] },
  { id: '4', name: 'Class 9', section: 'B', classTeacher: 'Rachel Kim', totalStudents: 36, capacity: 40, subjects: ['Math', 'Science', 'English', 'History', 'Geography'] },
  { id: '5', name: 'Class 8', section: 'A', classTeacher: 'Michael Chen', totalStudents: 34, capacity: 40, subjects: ['Math', 'Science', 'English', 'History', 'PE'] },
  { id: '6', name: 'Class 8', section: 'B', classTeacher: 'James Wright', totalStudents: 30, capacity: 40, subjects: ['Math', 'Science', 'English', 'History', 'PE'] },
  { id: '7', name: 'Class 7', section: 'A', classTeacher: 'Sarah Lee', totalStudents: 28, capacity: 35, subjects: ['Math', 'Science', 'English', 'Social Studies'] },
];

const Classes = () => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', section: '', classTeacher: '' });
  const filtered = mockClasses.filter(c => `${c.name} ${c.section}`.toLowerCase().includes(search.toLowerCase()) || c.classTeacher.toLowerCase().includes(search.toLowerCase()));

  const handleAddClass = () => {
    if (newClass.name && newClass.section && newClass.classTeacher) {
      setShowAddModal(false);
      setNewClass({ name: '', section: '', classTeacher: '' });
      alert('Class added successfully!');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes & Sections</h1>
          <p className="text-muted-foreground">Manage class structures and assignments</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Class
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search classes..." className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((cls, i) => (
          <motion.div key={cls.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">{cls.name}-{cls.section}</h3>
              <div className="rounded-lg bg-primary/10 p-2"><BookOpen className="h-4 w-4 text-primary" /></div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><UserCheck className="h-4 w-4" /><span className="text-foreground">{cls.classTeacher}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-foreground">{cls.totalStudents}/{cls.capacity} students</span>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Capacity</span><span className="text-foreground">{Math.round(cls.totalStudents / cls.capacity * 100)}%</span></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(cls.totalStudents / cls.capacity) * 100}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {cls.subjects.map(s => (
                  <span key={s} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Add Class</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Class Name *</label>
                <input value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} placeholder="e.g., Class 10" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Section *</label>
                <input value={newClass.section} onChange={e => setNewClass({ ...newClass, section: e.target.value })} placeholder="e.g., A" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Class Teacher *</label>
                <input value={newClass.classTeacher} onChange={e => setNewClass({ ...newClass, classTeacher: e.target.value })} placeholder="Enter teacher name" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                <button onClick={handleAddClass} className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Add Class</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Classes;
