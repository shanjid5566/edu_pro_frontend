import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Plus, Download, Eye, Pencil, Trash2, Mail, Phone, RefreshCw, Copy, Eye as EyeIcon, EyeOff, Loader } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from '@/hooks/use-toast';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchParents,
  searchParents,
  createParent,
  updateParent,
  deleteParent,
  fetchParentById,
  getOccupations,
  exportParentsCSV,
  clearSelectedParent,
  clearSearchResults,
} from '@/store/slices/parentSlice';

const mockParents = [
  { id: '1', name: 'Michael Johnson', email: 'mjohnson@email.com', phone: '+1 555 0101', occupation: 'Engineer', students: ['Sarah Johnson'], address: '123 Oak St', status: 'active' as const },
  { id: '2', name: 'Robert Williams', email: 'rwilliams@email.com', phone: '+1 555 0102', occupation: 'Doctor', students: ['James Williams'], address: '456 Elm St', status: 'active' as const },
  { id: '3', name: 'Thomas Davis', email: 'tdavis@email.com', phone: '+1 555 0103', occupation: 'Lawyer', students: ['Emma Davis'], address: '789 Pine St', status: 'active' as const },
  { id: '4', name: 'Carlos Martinez', email: 'cmartinez@email.com', phone: '+1 555 0104', occupation: 'Architect', students: ['Liam Martinez'], address: '321 Cedar St', status: 'active' as const },
  { id: '5', name: 'David Brown', email: 'dbrown@email.com', phone: '+1 555 0105', occupation: 'Teacher', students: ['Olivia Brown'], address: '654 Maple St', status: 'active' as const },
  { id: '6', name: 'Steven Wilson', email: 'swilson@email.com', phone: '+1 555 0106', occupation: 'Business Owner', students: ['Noah Wilson'], address: '987 Birch St', status: 'inactive' as const },
];

const Parents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { parents, selectedParent, searchResults, occupations, pagination, loading, searchLoading } = useSelector(
    (state: RootState) => state.parent
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterOccupation, setFilterOccupation] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    occupation: '',
    studentIds: [] as string[],
  });

  // Fetch parents and occupations on mount
  useEffect(() => {
    dispatch(fetchParents({ page: currentPage, limit: 10, search, occupation: filterOccupation !== 'all' ? filterOccupation : '' }));
    dispatch(getOccupations());
  }, [dispatch, currentPage, filterOccupation]);

  // Handle search with debounce
  useEffect(() => {
    if (search.trim()) {
      dispatch(searchParents({ query: search, limit: 10 }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [search, dispatch]);

  // Fetch parent details when viewing
  useEffect(() => {
    if (showViewModal) {
      dispatch(fetchParentById(showViewModal));
    } else {
      dispatch(clearSelectedParent());
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

  const handleAddParent = async () => {
    if (formData.fullName && formData.email && formData.password && formData.phone && formData.occupation) {
      try {
        if (editingParentId) {
          // Update existing parent
          const updateData = {
            fullName: formData.fullName,
            phone: formData.phone,
            occupation: formData.occupation,
          };
          await dispatch(updateParent({ parentId: editingParentId, data: updateData })).unwrap();
          toast({ title: 'Success', description: 'Parent updated successfully' });
          setEditingParentId(null);
        } else {
          // Create new parent
          const parentData = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            occupation: formData.occupation,
            studentIds: formData.studentIds,
          };
          await dispatch(createParent(parentData)).unwrap();
          toast({
            title: 'Parent Added Successfully',
            description: `Email: ${formData.email}\nPassword: ${formData.password}`,
          });
        }
        setShowAddModal(false);
        setFormData({
          fullName: '',
          email: '',
          password: '',
          phone: '',
          occupation: '',
          studentIds: [],
        });
        setShowPassword(false);
      } catch (error: any) {
        toast({ title: 'Error', description: error || 'Failed to save parent' });
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

  const handleDeleteParent = async (parentId: string, parentName: string) => {
    try {
      await dispatch(deleteParent(parentId)).unwrap();
      setShowDeleteModal(null);
      toast({ title: 'Success', description: `${parentName} has been deleted.` });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to delete parent' });
    }
  };

  const handleEditParent = (parentId: string) => {
    const parent = parents.find((p) => p.id === parentId);
    if (parent) {
      setFormData({
        fullName: parent.name,
        email: parent.email,
        password: '',
        phone: parent.phone,
        occupation: parent.occupation,
        studentIds: [],
      });
      setEditingParentId(parentId);
      setShowAddModal(true);
    }
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(
        exportParentsCSV({
          search,
          occupation: filterOccupation !== 'all' ? filterOccupation : '',
          status: '',
        })
      ).unwrap();
      
      // Create blob download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `parents_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast({ title: 'Success', description: 'Parents exported successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to export parents' });
    }
  };

  const filtered = searchResults.length > 0 ? searchResults : parents;
  const viewParent = selectedParent;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parents</h1>
          <p className="text-muted-foreground">Manage parent accounts and student associations</p>
        </div>
        <button
          onClick={() => {
            setEditingParentId(null);
            setFormData({
              fullName: '',
              email: '',
              password: '',
              phone: '',
              occupation: '',
              studentIds: [],
            });
            setShowAddModal(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Parent
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parents..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterOccupation}
            onChange={(e) => setFilterOccupation(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Occupations</option>
            {occupations.map((o) => (
              <option key={o} value={o}>
                {o}
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
        {loading && !parents.length ? (
          <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading parents...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No parents found
          </div>
        ) : (
          filtered.map((parent, i) => (
            <motion.div
              key={parent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warning/10 text-lg font-semibold text-warning">
                    {parent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{parent.name}</p>
                    <p className="text-xs text-muted-foreground">{parent.occupation}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    parent.status === 'active'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {parent.status}
                </span>
              </div>
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-foreground">{parent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="text-foreground">{parent.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Children</span>
                  <span className="text-foreground">{parent.childrenCount || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border pt-3">
                <button
                  onClick={() => setShowViewModal(parent.id)}
                  className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  <Eye className="mr-1 inline h-3.5 w-3.5" /> View
                </button>
                <button
                  onClick={() => handleEditParent(parent.id)}
                  className="flex-1 rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Pencil className="mr-1 inline h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(parent.id)}
                  className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Parent Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setShowPassword(false);
          setEditingParentId(null);
        }}
        title={editingParentId ? 'Edit Parent' : 'Add Parent'}
        description={editingParentId ? 'Update parent details' : 'Enter parent account details'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name *</label>
              <input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter parent name"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone *</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Occupation *</label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select Occupation</option>
                {occupations.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!editingParentId && (
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
                setEditingParentId(null);
              }}
              className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddParent}
              disabled={loading}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : editingParentId ? 'Update Parent' : 'Add Parent'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Parent Modal */}
      <Modal open={!!showViewModal} onClose={() => setShowViewModal(null)} title="Parent Profile" size="lg">
        {viewParent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 text-2xl font-bold text-warning">
                {viewParent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{viewParent.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {viewParent.email} · {viewParent.occupation}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    viewParent.status === 'active'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {viewParent.status}
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border p-4">
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{viewParent.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Occupation</p>
                <p className="text-sm font-medium text-foreground">{viewParent.occupation}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">Children</p>
                <p className="text-sm font-medium text-foreground">
                  {Array.isArray(viewParent.children) && viewParent.children.length > 0
                    ? viewParent.children.join(', ')
                    : 'No children linked'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Parent" size="sm">
        {showDeleteModal && (
          <div className="space-y-4">
            {(() => {
              const parent = parents.find((p) => p.id === showDeleteModal);
              return (
                <>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <strong className="text-foreground">{parent?.name}</strong>? This
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
                        if (parent) {
                          handleDeleteParent(parent.id, parent.name);
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

export default Parents;
