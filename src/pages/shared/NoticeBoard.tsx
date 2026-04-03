import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Pin, Bell, Plus, X, Edit2, Trash2, Loader } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { fetchNotices, createNotice, updateNotice, deleteNotice, pinNotice, searchNotices } from '@/store/slices/noticeSlice';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/use-toast';
import type { NoticeCategory, NoticePriority } from '@/store/slices/noticeSlice';

const categoryStyles: Record<string, { color: string; bg: string; label: string }> = {
  GENERAL: { color: 'text-primary', bg: 'bg-primary/10', label: 'General' },
  EXAM: { color: 'text-warning', bg: 'bg-warning/10', label: 'Exam' },
  EVENT: { color: 'text-info', bg: 'bg-info/10', label: 'Event' },
  HOLIDAY: { color: 'text-success', bg: 'bg-success/10', label: 'Holiday' },
};

const priorityStyles: Record<string, string> = {
  normal: 'border-border',
  high: 'border-warning/50 bg-warning/5',
  urgent: 'border-destructive/50 bg-destructive/5',
};

const NoticeBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { notices, loading, error } = useSelector((state: RootState) => state.notice);

  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'GENERAL' as NoticeCategory,
    priority: 'normal' as NoticePriority,
    pinned: false,
  });

  useEffect(() => {
    const loadNotices = async () => {
      try {
        await dispatch(fetchNotices({ page: 1, limit: 100, category: filter, search })).unwrap();
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err || 'Failed to load notices',
          variant: 'destructive',
        });
      }
    };

    loadNotices();
  }, [dispatch, filter, search, toast]);

  const pinnedNotices = notices.filter((n) => n.pinned);
  const otherNotices = notices.filter((n) => !n.pinned);

  const handleAddNotice = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and message are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await dispatch(createNotice(formData)).unwrap();
      setShowAddModal(false);
      setFormData({
        title: '',
        message: '',
        category: 'GENERAL',
        priority: 'normal',
        pinned: false,
      });
      toast({
        title: 'Success',
        description: 'Notice created successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err || 'Failed to create notice',
        variant: 'destructive',
      });
    }
  };

  const handleEditNotice = async () => {
    if (!editingNoticeId) return;
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title and message are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await dispatch(
        updateNotice({
          id: editingNoticeId,
          data: formData,
        })
      ).unwrap();
      setShowEditModal(false);
      setEditingNoticeId(null);
      setFormData({
        title: '',
        message: '',
        category: 'GENERAL',
        priority: 'normal',
        pinned: false,
      });
      toast({
        title: 'Success',
        description: 'Notice updated successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err || 'Failed to update notice',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNotice = async () => {
    if (!editingNoticeId) return;

    try {
      await dispatch(deleteNotice(editingNoticeId)).unwrap();
      setShowDeleteModal(false);
      setEditingNoticeId(null);
      toast({
        title: 'Success',
        description: 'Notice deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err || 'Failed to delete notice',
        variant: 'destructive',
      });
    }
  };

  const handlePinNotice = async (noticeId: string) => {
    try {
      await dispatch(pinNotice(noticeId)).unwrap();
      toast({
        title: 'Success',
        description: 'Notice pin status updated successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err || 'Failed to pin notice',
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (notice: any) => {
    setEditingNoticeId(notice.id);
    setFormData({
      title: notice.title,
      message: notice.message,
      category: notice.category,
      priority: notice.priority,
      pinned: notice.pinned,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (noticeId: string) => {
    setEditingNoticeId(noticeId);
    setShowDeleteModal(true);
  };

  const NoticeCard = ({ notice, showActions = false }: { notice: any; showActions?: boolean }) => {
    const cat = categoryStyles[notice.category] || categoryStyles.GENERAL;
    const date = new Date(notice.createdAt).toLocaleDateString();

    return (
      <div
        className={`rounded-xl border-2 ${notice.pinned ? 'border-primary/20 bg-card' : 'border-border bg-card'} p-5 ${
          priorityStyles[notice.priority]
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <Megaphone className={`h-5 w-5 ${notice.pinned ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="font-semibold text-foreground">{notice.title}</h3>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cat.bg} ${cat.color} whitespace-nowrap`}>
            {cat.label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{notice.message}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </span>
            <span>By: {notice.author.name}</span>
          </div>
          {showActions && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePinNotice(notice.id)}
                className={`p-1.5 rounded hover:bg-secondary transition-colors ${
                  notice.pinned ? 'text-primary' : 'text-muted-foreground'
                }`}
                title={notice.pinned ? 'Unpin' : 'Pin'}
              >
                <Pin className="h-4 w-4" />
              </button>
              <button
                onClick={() => openEditModal(notice)}
                className="p-1.5 rounded text-muted-foreground hover:bg-secondary transition-colors"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => openDeleteModal(notice.id)}
                className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && notices.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notice Board</h1>
          <p className="text-muted-foreground">Official notices and announcements from the school</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Notice
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'GENERAL', 'EXAM', 'EVENT', 'HOLIDAY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Notices */}
      {pinnedNotices.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Pin className="h-4 w-4 text-primary" /> Pinned
          </h3>
          {pinnedNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} showActions={true} />
          ))}
        </div>
      )}

      {/* Other Notices */}
      <div className="space-y-3">
        {pinnedNotices.length > 0 && otherNotices.length > 0 && (
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Bell className="h-4 w-4 text-muted-foreground" /> Recent
          </h3>
        )}
        {otherNotices.length > 0 ? (
          otherNotices.map((notice) => <NoticeCard key={notice.id} notice={notice} showActions={true} />)
        ) : (
          pinnedNotices.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No notices available
            </div>
          )
        )}
      </div>

      {/* Add Notice Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Notice">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notice title"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as NoticeCategory })}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="GENERAL">General</option>
              <option value="EXAM">Exam</option>
              <option value="EVENT">Event</option>
              <option value="HOLIDAY">Holiday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as NoticePriority })}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter notice message"
              className="min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded border-border"
            />
            <span className="text-sm font-medium text-foreground">Pin this notice</span>
          </label>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNotice}
              disabled={loading}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin inline mr-2" /> : null}
              Add Notice
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Notice Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Notice">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notice title"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as NoticeCategory })}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="GENERAL">General</option>
              <option value="EXAM">Exam</option>
              <option value="EVENT">Event</option>
              <option value="HOLIDAY">Holiday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as NoticePriority })}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter notice message"
              className="min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded border-border"
            />
            <span className="text-sm font-medium text-foreground">Pin this notice</span>
          </label>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditNotice}
              disabled={loading}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin inline mr-2" /> : null}
              Update Notice
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Notice">
        <div className="space-y-4">
          <p className="text-muted-foreground">Are you sure you want to delete this notice? This action cannot be undone.</p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteNotice}
              disabled={loading}
              className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin inline mr-2" /> : null}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default NoticeBoard;
