import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, Download, Eye, Pencil, Trash2, X, Save, Copy, RefreshCw, Eye as EyeIcon, EyeOff, Loader } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from '@/hooks/use-toast';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchStudents,
  searchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchStudentById,
  getClasses,
  exportStudentsCSV,
  clearSelectedStudent,
  clearSearchResults,
} from '@/store/slices/studentSlice';

const Students = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, selectedStudent, searchResults, classes, pagination, loading, searchLoading } = useSelector(
    (state: RootState) => state.student
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    classId: '',
    section: 'A',
    rollNumber: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    parentName: '',
    address: '',
    password: '',
  });

  // Fetch students and classes on mount
  useEffect(() => {
    dispatch(fetchStudents({ page: currentPage, limit: 10, search, classId: filterClass !== 'all' ? filterClass : '' }));
    dispatch(getClasses());
  }, [dispatch, currentPage, filterClass]);

  // Handle search with debounce
  useEffect(() => {
    if (search.trim()) {
      dispatch(searchStudents({ query: search, limit: 10 }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [search, dispatch]);

  // Fetch student details when viewing
  useEffect(() => {
    if (showViewModal) {
      dispatch(fetchStudentById(showViewModal));
    } else {
      dispatch(clearSelectedStudent());
    }
  }, [showViewModal, dispatch]);

  const generatePassword = () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + symbols;
    
    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const handlePasswordGenerate = () => {
    const newPassword = generatePassword();
    setFormData({ ...formData, password: newPassword });
    toast({ title: 'Password Generated', description: 'A strong password has been generated.' });
  };

  const handleAddStudent = async () => {
    if (formData.fullName && formData.email && formData.password && formData.classId) {
      try {
        if (editingStudentId) {
          // Update existing student
          const updateData = {
            fullName: formData.fullName,
            grade: (formData as any).grade || '',
            status: (formData as any).status || 'active',
          };
          await dispatch(updateStudent({ studentId: editingStudentId, data: updateData })).unwrap();
          toast({ title: 'Success', description: 'Student updated successfully' });
          setEditingStudentId(null);
        } else {
          // Create new student
          await dispatch(createStudent(formData)).unwrap();
          toast({
            title: 'Student Added Successfully',
            description: `Email: ${formData.email}\nPassword: ${formData.password}`,
          });
        }
        setShowAddModal(false);
        setFormData({
          fullName: '',
          email: '',
          classId: '',
          section: 'A',
          rollNumber: '',
          dateOfBirth: '',
          gender: 'Male',
          phone: '',
          parentName: '',
          address: '',
          password: '',
        });
        setShowPassword(false);
      } catch (error: any) {
        toast({ title: 'Error', description: error || 'Failed to save student' });
      }
    } else {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields (Name, Email, Password, Class)',
      });
    }
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(formData.password);
    toast({ title: 'Copied', description: 'Password copied to clipboard.' });
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    try {
      await dispatch(deleteStudent(studentId)).unwrap();
      setShowDeleteModal(null);
      toast({ title: 'Success', description: `${studentName} has been deleted.` });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to delete student' });
    }
  };

  const handleEditStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setFormData({
        fullName: student.name,
        email: student.email,
        classId: student.class,
        section: student.section,
        rollNumber: student.rollNumber,
        dateOfBirth: '',
        gender: 'Male',
        phone: '',
        parentName: '',
        address: '',
        password: '',
      });
      setEditingStudentId(studentId);
      setShowAddModal(true);
    }
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(
        exportStudentsCSV({
          search,
          classId: filterClass !== 'all' ? filterClass : '',
          status: '',
        })
      ).unwrap();
      
      // Create blob download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast({ title: 'Success', description: 'Students exported successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to export students' });
    }
  };

  const filtered = searchResults.length > 0 ? searchResults : students;
  const viewStudent = selectedStudent;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage all enrolled students</p>
        </div>
        <button
          onClick={() => {
            setEditingStudentId(null);
            setFormData({
              fullName: '',
              email: '',
              classId: '',
              section: 'A',
              rollNumber: '',
              dateOfBirth: '',
              gender: 'Male',
              phone: '',
              parentName: '',
              address: '',
              password: '',
            });
            setShowAddModal(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
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
            {classes.map(c => <option key={c.id} value={c.id}>Class {c.name}</option>)}
          </select>
          <button onClick={handleExport} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors">
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
            {loading && !students.length ? (
              <tr className="border-b border-border">
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading students...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr className="border-b border-border">
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No students found
                </td>
              </tr>
            ) : (
              filtered.map((student, i) => (
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
                      <button onClick={() => handleEditStudent(student.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setShowDeleteModal(student.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {pagination.total} students
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: pagination.pages || 1 }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-9 rounded-lg px-3 text-sm transition-colors ${
                currentPage === page
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-foreground hover:bg-secondary'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(pagination.pages || 1, currentPage + 1))}
            disabled={currentPage === (pagination.pages || 1) || loading}
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setShowPassword(false);
          setEditingStudentId(null);
        }}
        title={editingStudentId ? 'Edit Student' : 'Add New Student'}
        description={editingStudentId ? 'Update student details' : 'Enter student details and set password for first login'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name *</label>
              <input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@school.com"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Class *</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Class {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Roll Number</label>
              <input
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. 101"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555 0000"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Parent Name</label>
              <input
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Enter parent name"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Address</label>
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Login Credentials *</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Password *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                      placeholder="Enter password or generate one" 
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none pr-10" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={handlePasswordGenerate}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" /> Generate
                  </button>
                  {formData.password && (
                    <button 
                      type="button"
                      onClick={copyPasswordToClipboard}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary/10 px-3 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Copy className="h-4 w-4" /> Copy
                    </button>
                  )}
                </div>
              </div>
              <div className="rounded-md bg-warning/10 p-2.5">
                <p className="text-xs text-warning">
                  <strong>Note:</strong> Share this password with the student for first login. The student can change it from their profile settings after logging in.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => { setShowAddModal(false); setShowPassword(false); }} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
            <button onClick={handleAddStudent} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><Save className="h-4 w-4" /> Save Student</button>
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
        {showDeleteModal && (
          <div className="space-y-4">
            {(() => {
              const student = students.find((s) => s.id === showDeleteModal);
              return (
                <>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <strong className="text-foreground">{student?.name}</strong>? This
                    action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowDeleteModal(null)}
                      className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (student) {
                          handleDeleteStudent(student.id, student.name);
                        }
                      }}
                      disabled={loading}
                      className="h-10 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Students;
