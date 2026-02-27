import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockTeachers } from '@/services/mockData';
import { Search, Plus, Download, Eye, Pencil, Trash2, Save } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from '@/hooks/use-toast';

const Teachers = () => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filtered = mockTeachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.department.toLowerCase().includes(search.toLowerCase())
  );

  const viewTeacher = mockTeachers.find(t => t.id === showViewModal);
  const deleteTeacher = mockTeachers.find(t => t.id === showDeleteModal);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Teachers</h1><p className="text-muted-foreground">Manage faculty members</p></div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Plus className="h-4 w-4" /> Add Teacher</button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors"><Download className="h-4 w-4" /> Export</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((teacher, i) => (
          <motion.div key={teacher.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">{teacher.name.charAt(0)}</div>
                <div><p className="font-semibold text-foreground">{teacher.name}</p><p className="text-xs text-muted-foreground">{teacher.department}</p></div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${teacher.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{teacher.status}</span>
            </div>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subjects</span><span className="text-foreground">{teacher.subjects.join(', ')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Classes</span><span className="text-foreground">{teacher.classes.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Attendance</span><span className="text-foreground">{teacher.attendance}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Classes Taken</span><span className="text-foreground">{teacher.classesTaken}</span></div>
            </div>
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <button onClick={() => setShowViewModal(teacher.id)} className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"><Eye className="mr-1 inline h-3.5 w-3.5" /> View</button>
              <button onClick={() => setShowAddModal(true)} className="flex-1 rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"><Pencil className="mr-1 inline h-3.5 w-3.5" /> Edit</button>
              <button onClick={() => setShowDeleteModal(teacher.id)} className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Teacher Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Teacher" description="Enter teacher details" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label><input placeholder="Enter full name" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Email</label><input type="email" placeholder="teacher@school.com" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label><input placeholder="+1 555 0000" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Department</label><select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"><option>Science</option><option>Language Arts</option><option>Social Studies</option><option>Technology</option><option>Sports</option></select></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Subjects</label><input placeholder="e.g. Mathematics, Physics" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Assign Classes</label><input placeholder="e.g. 10-A, 10-B, 9-A" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Join Date</label><input type="date" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddModal(false)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={() => { setShowAddModal(false); toast({ title: 'Teacher Added', description: 'New teacher has been added successfully.' }); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Save className="h-4 w-4" /> Save Teacher</button>
          </div>
        </div>
      </Modal>

      {/* View Teacher Modal */}
      <Modal open={!!showViewModal} onClose={() => setShowViewModal(null)} title="Teacher Profile" size="lg">
        {viewTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">{viewTeacher.name.charAt(0)}</div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{viewTeacher.name}</h3>
                <p className="text-sm text-muted-foreground">{viewTeacher.email} · {viewTeacher.department}</p>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${viewTeacher.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{viewTeacher.status}</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border p-4">
              <div><p className="text-xs text-muted-foreground">Subjects</p><p className="text-sm font-medium text-foreground">{viewTeacher.subjects.join(', ')}</p></div>
              <div><p className="text-xs text-muted-foreground">Classes Assigned</p><p className="text-sm font-medium text-foreground">{viewTeacher.classes.join(', ')}</p></div>
              <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium text-foreground">{viewTeacher.phone}</p></div>
              <div><p className="text-xs text-muted-foreground">Join Date</p><p className="text-sm font-medium text-foreground">{viewTeacher.joinDate}</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4 text-center"><p className="text-sm text-muted-foreground">Attendance</p><p className="text-2xl font-bold text-foreground">{viewTeacher.attendance}%</p></div>
              <div className="rounded-lg border border-border p-4 text-center"><p className="text-sm text-muted-foreground">Classes Taken</p><p className="text-2xl font-bold text-primary">{viewTeacher.classesTaken}</p></div>
              <div className="rounded-lg border border-border p-4 text-center"><p className="text-sm text-muted-foreground">Total Classes</p><p className="text-2xl font-bold text-foreground">{viewTeacher.classes.length}</p></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Teacher" size="sm">
        {deleteTeacher && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong className="text-foreground">{deleteTeacher.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteModal(null)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={() => { setShowDeleteModal(null); toast({ title: 'Teacher Deleted', description: `${deleteTeacher.name} has been removed.` }); }} className="h-10 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Teachers;
