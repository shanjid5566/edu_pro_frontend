import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Plus, Download, Eye, Pencil, Trash2, Save, RefreshCw, Copy, Eye as EyeIcon, EyeOff, Loader } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from '@/hooks/use-toast';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchTeachers,
  searchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  fetchTeacherById,
  getDepartments,
  exportTeachersCSV,
  clearSelectedTeacher,
  clearSearchResults,
} from '@/store/slices/teacherSlice';

const Teachers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teachers, selectedTeacher, searchResults, departments, pagination, loading, searchLoading } = useSelector(
    (state: RootState) => state.teacher
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    subjects: '',
    assignClasses: '',
    joinDate: '',
  });

  // Fetch teachers and departments on mount
  useEffect(() => {
    dispatch(fetchTeachers({ page: currentPage, limit: 10, search, department: filterDepartment !== 'all' ? filterDepartment : '' }));
    dispatch(getDepartments());
  }, [dispatch, currentPage, filterDepartment]);

  // Handle search with debounce
  useEffect(() => {
    if (search.trim()) {
      dispatch(searchTeachers({ query: search, limit: 10 }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [search, dispatch]);

  // Fetch teacher details when viewing
  useEffect(() => {
    if (showViewModal) {
      dispatch(fetchTeacherById(showViewModal));
    } else {
      dispatch(clearSelectedTeacher());
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

  const handleAddTeacher = async () => {
    if (formData.fullName && formData.email && formData.password && formData.department && formData.joinDate) {
      try {
        if (editingTeacherId) {
          // Update existing teacher
          const updateData = {
            fullName: formData.fullName,
            phone: formData.phone,
            department: formData.department,
          };
          await dispatch(updateTeacher({ teacherId: editingTeacherId, data: updateData })).unwrap();
          toast({ title: 'Success', description: 'Teacher updated successfully' });
          setEditingTeacherId(null);
        } else {
          // Create new teacher
          const teacherData = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            department: formData.department,
            subjects: formData.subjects ? formData.subjects.split(',').map(s => s.trim()) : [],
            assignClasses: formData.assignClasses ? formData.assignClasses.split(',').map(c => c.trim()) : [],
            joinDate: formData.joinDate,
          };
          await dispatch(createTeacher(teacherData)).unwrap();
          toast({
            title: 'Teacher Added Successfully',
            description: `Email: ${formData.email}\nPassword: ${formData.password}`,
          });
        }
        setShowAddModal(false);
        setFormData({
          fullName: '',
          email: '',
          password: '',
          phone: '',
          department: '',
          subjects: '',
          assignClasses: '',
          joinDate: '',
        });
        setShowPassword(false);
      } catch (error: any) {
        toast({ title: 'Error', description: error || 'Failed to save teacher' });
      }
    } else {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
      });
    }
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(formData.password);
    toast({ title: 'Copied', description: 'Password copied to clipboard.' });
  };

  const handleDeleteTeacher = async (teacherId: string, teacherName: string) => {
    try {
      await dispatch(deleteTeacher(teacherId)).unwrap();
      setShowDeleteModal(null);
      toast({ title: 'Success', description: `${teacherName} has been deleted.` });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to delete teacher' });
    }
  };

  const handleEditTeacher = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher) {
      setFormData({
        fullName: teacher.name,
        email: teacher.email,
        password: '',
        phone: teacher.phone,
        department: teacher.department,
        subjects: Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : teacher.subjects,
        assignClasses: '',
        joinDate: teacher.joinDate ? teacher.joinDate.split('T')[0] : '',
      });
      setEditingTeacherId(teacherId);
      setShowAddModal(true);
    }
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(
        exportTeachersCSV({
          search,
          department: filterDepartment !== 'all' ? filterDepartment : '',
          status: '',
        })
      ).unwrap();
      
      // Create blob download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `teachers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast({ title: 'Success', description: 'Teachers exported successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to export teachers' });
    }
  };

  const filtered = searchResults.length > 0 ? searchResults : teachers;
  const viewTeacher = selectedTeacher;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage faculty members</p>
        </div>
        <button
          onClick={() => {
            setEditingTeacherId(null);
            setFormData({
              fullName: '',
              email: '',
              password: '',
              phone: '',
              department: '',
              subjects: '',
              assignClasses: '',
              joinDate: '',
            });
            setShowAddModal(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Teacher
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teachers..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && !teachers.length ? (
          <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading teachers...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No teachers found
          </div>
        ) : (
          filtered.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {teacher.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground">{teacher.department}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    teacher.status === 'active'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {teacher.status}
                </span>
              </div>
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subjects</span>
                  <span className="text-foreground">
                    {Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : teacher.subjects || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classes Assigned</span>
                  <span className="text-foreground">{teacher.classesAssigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classes Taken</span>
                  <span className="text-foreground">{teacher.classesTaken}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border pt-3">
                <button
                  onClick={() => setShowViewModal(teacher.id)}
                  className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  <Eye className="mr-1 inline h-3.5 w-3.5" /> View
                </button>
                <button
                  onClick={() => handleEditTeacher(teacher.id)}
                  className="flex-1 rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Pencil className="mr-1 inline h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(teacher.id)}
                  className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Teacher Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setShowPassword(false);
          setEditingTeacherId(null);
        }}
        title={editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}
        description={editingTeacherId ? 'Update teacher details' : 'Enter teacher details'}
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
                placeholder="teacher@school.com"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Subjects</label>
              <input
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                placeholder="e.g. Mathematics, Physics"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Assign Classes</label>
              <input
                value={formData.assignClasses}
                onChange={(e) => setFormData({ ...formData, assignClasses: e.target.value })}
                placeholder="e.g. 10-A, 10-B, 9-A"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Join Date *</label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {!editingTeacherId && (
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
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setShowAddModal(false);
                setShowPassword(false);
                setEditingTeacherId(null);
              }}
              className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTeacher}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save Teacher'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Teacher Modal */}
      <Modal open={!!showViewModal} onClose={() => setShowViewModal(null)} title="Teacher Profile" size="lg">
        {viewTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {viewTeacher.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{viewTeacher.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {viewTeacher.email} · {viewTeacher.department}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    viewTeacher.status === 'active'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {viewTeacher.status}
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border p-4">
              <div>
                <p className="text-xs text-muted-foreground">Subjects</p>
                <p className="text-sm font-medium text-foreground">
                  {Array.isArray(viewTeacher.subjects)
                    ? viewTeacher.subjects.join(', ')
                    : viewTeacher.subjects || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Classes Assigned</p>
                <p className="text-sm font-medium text-foreground">
                  {Array.isArray(viewTeacher.classesAssigned)
                    ? viewTeacher.classesAssigned.join(', ')
                    : viewTeacher.classesAssigned || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{viewTeacher.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Join Date</p>
                <p className="text-sm font-medium text-foreground">
                  {viewTeacher.joinDate
                    ? new Date(viewTeacher.joinDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Classes Taken</p>
                <p className="text-2xl font-bold text-foreground">{viewTeacher.classesTaken}</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Classes Assigned</p>
                <p className="text-2xl font-bold text-primary">{viewTeacher.classesAssigned || 0}</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-success capitalize">{viewTeacher.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Teacher" size="sm">
        {showDeleteModal && (
          <div className="space-y-4">
            {(() => {
              const teacher = teachers.find((t) => t.id === showDeleteModal);
              return (
                <>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <strong className="text-foreground">{teacher?.name}</strong>? This
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
                        if (teacher) {
                          handleDeleteTeacher(teacher.id, teacher.name);
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

export default Teachers;
