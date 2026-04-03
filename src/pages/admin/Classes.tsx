import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Plus, Users, BookOpen, UserCheck, X, Loader, Download, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Modal from '@/components/ui/Modal';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchClasses,
  fetchClassById,
  searchClasses,
  createClass,
  updateClass,
  deleteClass,
  getTeachers,
  exportClassesCSV,
  clearSelectedClass,
  clearSearchResults,
} from '@/store/slices/classSlice';

const Classes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classes, selectedClass, searchResults, teachers, pagination, loading, searchLoading } = useSelector(
    (state: RootState) => state.class
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    capacity: 40,
    classTeacherId: '',
  });

  // Fetch classes on mount and when page/filters change
  useEffect(() => {
    dispatch(fetchClasses({ page: currentPage, limit: 10 }));
    dispatch(getTeachers());
  }, [dispatch, currentPage]);

  // Search classes when search query changes
  useEffect(() => {
    if (search.trim()) {
      dispatch(searchClasses({ q: search, limit: 10 }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [search, dispatch]);

  // Fetch class details when viewing
  useEffect(() => {
    if (showViewModal) {
      dispatch(fetchClassById(showViewModal));
    }
  }, [showViewModal, dispatch]);

  const handleAddClass = async () => {
    if (!formData.name || !formData.section || !formData.classTeacherId) {
      toast({ title: 'Error', description: 'Please fill in all fields' });
      return;
    }

    try {
      if (editingClassId) {
        await dispatch(updateClass({ id: editingClassId, ...formData })).unwrap();
        toast({ title: 'Success', description: 'Class updated successfully' });
      } else {
        await dispatch(createClass(formData)).unwrap();
        toast({ title: 'Success', description: 'Class created successfully' });
      }
      setShowAddModal(false);
      setEditingClassId(null);
      setFormData({ name: '', section: '', capacity: 40, classTeacherId: '' });
      dispatch(fetchClasses({ page: currentPage, limit: 10 }));
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to save class' });
    }
  };

  const handleDeleteClass = async (id: string, name: string) => {
    try {
      await dispatch(deleteClass(id)).unwrap();
      toast({ title: 'Success', description: `${name} deleted successfully` });
      setShowDeleteModal(null);
      dispatch(fetchClasses({ page: currentPage, limit: 10 }));
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to delete class' });
    }
  };

  const handleEditClass = (classId: string) => {
    const classToEdit = classes.find((c) => c.id === classId);
    if (classToEdit) {
      setFormData({
        name: classToEdit.name,
        section: classToEdit.section,
        capacity: classToEdit.capacity,
        classTeacherId: typeof classToEdit.classTeacher === 'string' ? '' : classToEdit.classTeacher?.id || '',
      });
      setEditingClassId(classId);
      setShowAddModal(true);
    }
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(
        exportClassesCSV({
          search,
          section: '',
        })
      ).unwrap();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `classes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast({ title: 'Success', description: 'Classes exported successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to export classes' });
    }
  };

  const filtered = searchResults.length > 0 ? searchResults : classes;
  const viewClass = selectedClass;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes & Sections</h1>
          <p className="text-muted-foreground">Manage class structures and assignments</p>
        </div>
        <button
          onClick={() => {
            setEditingClassId(null);
            setFormData({ name: '', section: '', capacity: 40, classTeacherId: '' });
            setShowAddModal(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Class
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <button
          onClick={handleExport}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading && !classes.length ? (
          <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading classes...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No classes found
          </div>
        ) : (
          filtered.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {cls.name}-{cls.section}
                </h3>
                <div className="rounded-lg bg-primary/10 p-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  <span className="text-foreground">
                    {typeof cls.classTeacher === 'string' ? cls.classTeacher : cls.classTeacher?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-foreground">
                    {cls.studentCount}/{cls.capacity} students
                  </span>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="text-foreground">{cls.capacityPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${cls.capacityPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {cls.subjectCount && cls.subjectCount > 0 ? (
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                      {cls.subjectCount} Subjects
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">No subjects assigned</span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                <button
                  onClick={() => setShowViewModal(cls.id)}
                  className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  <Eye className="mr-1 inline h-3.5 w-3.5" /> View
                </button>
                <button
                  onClick={() => handleEditClass(cls.id)}
                  className="flex-1 rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Pencil className="mr-1 inline h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(cls.id)}
                  className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Class Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingClassId(null);
        }}
        title={editingClassId ? 'Edit Class' : 'Add Class'}
        description={editingClassId ? 'Update class details' : 'Enter class details'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Class Name *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., 10th Grade"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Section *</label>
              <input
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g., A"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Capacity *</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 40 })}
                placeholder="40"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Class Teacher *</label>
              <select
                value={formData.classTeacherId}
                onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingClassId(null);
              }}
              className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddClass}
              disabled={loading}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : editingClassId ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Class Modal */}
      <Modal open={!!showViewModal} onClose={() => setShowViewModal(null)} title="Class Details" size="lg">
        {viewClass && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {viewClass.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {viewClass.name}-{viewClass.section}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {viewClass.studentCount}/{viewClass.capacity} Students • Capacity: {viewClass.capacityPercentage}%
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border p-4">
              <div>
                <p className="text-xs text-muted-foreground">Class Teacher</p>
                <p className="text-sm font-medium text-foreground">
                  {typeof viewClass.classTeacher === 'string' ? viewClass.classTeacher : viewClass.classTeacher?.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="text-sm font-medium text-foreground">{viewClass.capacity}</p>
              </div>
            </div>
            {viewClass.subjects && viewClass.subjects.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {viewClass.subjects.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {viewClass.students && viewClass.students.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Students ({viewClass.students.length})</p>
                <div className="grid gap-2">
                  {viewClass.students.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg border border-border p-2 text-sm"
                    >
                      <span className="text-foreground">{s.name}</span>
                      <span className="text-xs text-muted-foreground">Roll: {s.rollNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Class" size="sm">
        {showDeleteModal && (
          <div className="space-y-4">
            {(() => {
              const cls = classes.find((c) => c.id === showDeleteModal);
              return (
                <>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <strong className="text-foreground">{cls?.name}-{cls?.section}</strong>? This action cannot be undone.
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
                        if (cls) {
                          handleDeleteClass(cls.id, `${cls.name}-${cls.section}`);
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

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
            disabled={currentPage === pagination.pages}
            className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Classes;
