import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockStudents } from '@/services/mockData';
import { Search, Plus, Filter, Download, Eye, Pencil, Trash2, X, Save } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from '@/hooks/use-toast';

const Students = () => {
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filtered = mockStudents.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'all' || s.class === filterClass;
    return matchSearch && matchClass;
  });

  const classes = [...new Set(mockStudents.map(s => s.class))].sort();
  const viewStudent = mockStudents.find(s => s.id === showViewModal);
  const deleteStudent = mockStudents.find(s => s.id === showDeleteModal);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage all enrolled students</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
        </div>
        <div className="flex gap-2">
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="all">All Classes</option>
            {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Student</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Class</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Roll No</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Attendance</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Grade</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student, i) => (
              <motion.tr key={student.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{student.name.charAt(0)}</div>
                    <div><p className="font-medium text-foreground">{student.name}</p><p className="text-xs text-muted-foreground">{student.email}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{student.class}-{student.section}</td>
                <td className="px-4 py-3 text-foreground">{student.rollNumber}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                      <div className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-success' : student.attendance >= 75 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${student.attendance}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{student.attendance}%</span>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{student.grade}</span></td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${student.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{student.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setShowViewModal(student.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => setShowAddModal(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setShowDeleteModal(student.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {filtered.length} of {mockStudents.length} students</p>
        <div className="flex gap-1">
          <button className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors">Previous</button>
          <button className="h-9 rounded-lg bg-primary px-3 text-sm text-primary-foreground">1</button>
          <button className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors">2</button>
          <button className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors">Next</button>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Student" description="Enter student details" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label><input placeholder="Enter full name" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Email</label><input type="email" placeholder="student@school.com" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Class</label><select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"><option>10</option><option>9</option><option>8</option><option>7</option></select></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Section</label><select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"><option>A</option><option>B</option><option>C</option></select></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Roll Number</label><input placeholder="e.g. 101" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Date of Birth</label><input type="date" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Gender</label><select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label><input placeholder="+1 555 0000" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Parent Name</label><input placeholder="Enter parent name" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-foreground">Address</label><input placeholder="Enter address" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddModal(false)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={() => { setShowAddModal(false); toast({ title: 'Student Added', description: 'New student has been added successfully.' }); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Save className="h-4 w-4" /> Save Student</button>
          </div>
        </div>
      </Modal>

      {/* View Student Modal */}
      <Modal open={!!showViewModal} onClose={() => setShowViewModal(null)} title="Student Profile" size="lg">
        {viewStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">{viewStudent.name.charAt(0)}</div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{viewStudent.name}</h3>
                <p className="text-sm text-muted-foreground">{viewStudent.email}</p>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${viewStudent.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{viewStudent.status}</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border p-4">
              <div><p className="text-xs text-muted-foreground">Class & Section</p><p className="text-sm font-medium text-foreground">{viewStudent.class}-{viewStudent.section}</p></div>
              <div><p className="text-xs text-muted-foreground">Roll Number</p><p className="text-sm font-medium text-foreground">{viewStudent.rollNumber}</p></div>
              <div><p className="text-xs text-muted-foreground">Date of Birth</p><p className="text-sm font-medium text-foreground">{viewStudent.dateOfBirth}</p></div>
              <div><p className="text-xs text-muted-foreground">Gender</p><p className="text-sm font-medium text-foreground capitalize">{viewStudent.gender}</p></div>
              <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium text-foreground">{viewStudent.phone}</p></div>
              <div><p className="text-xs text-muted-foreground">Address</p><p className="text-sm font-medium text-foreground">{viewStudent.address}</p></div>
              <div><p className="text-xs text-muted-foreground">Parent</p><p className="text-sm font-medium text-foreground">{viewStudent.parentName}</p></div>
              <div><p className="text-xs text-muted-foreground">Admission Date</p><p className="text-sm font-medium text-foreground">{viewStudent.admissionDate}</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4 text-center"><p className="text-sm text-muted-foreground">Attendance</p><p className="text-2xl font-bold text-foreground">{viewStudent.attendance}%</p></div>
              <div className="rounded-lg border border-border p-4 text-center"><p className="text-sm text-muted-foreground">Grade</p><p className="text-2xl font-bold text-primary">{viewStudent.grade}</p></div>
              <div className="rounded-lg border border-border p-4 text-center"><p className="text-sm text-muted-foreground">Status</p><p className="text-2xl font-bold text-success capitalize">{viewStudent.status}</p></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Student" size="sm">
        {deleteStudent && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong className="text-foreground">{deleteStudent.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteModal(null)} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={() => { setShowDeleteModal(null); toast({ title: 'Student Deleted', description: `${deleteStudent.name} has been removed.` }); }} className="h-10 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Students;
