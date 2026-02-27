import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Pin, Bell, Plus, X } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  message: string;
  date: string;
  category: 'general' | 'exam' | 'event' | 'holiday';
  pinned: boolean;
  author: string;
}

const notices: Notice[] = [
  { id: '1', title: 'Annual Sports Day', message: 'Annual Sports Day will be held on March 20, 2026. All students must participate in at least one event. Registration forms are available at the front office.', date: '2026-02-26', category: 'event', pinned: true, author: 'Admin Office' },
  { id: '2', title: 'Mid-Term Exam Schedule', message: 'Mid-term examinations will begin from March 15, 2026. The detailed schedule has been uploaded to the Exams section. Students are advised to prepare accordingly.', date: '2026-02-25', category: 'exam', pinned: true, author: 'Examination Cell' },
  { id: '3', title: 'Parent-Teacher Meeting', message: 'PTA meeting is scheduled for March 10, 2026 at 10:00 AM in the school auditorium. Parents of all classes are requested to attend.', date: '2026-02-24', category: 'general', pinned: false, author: 'Principal' },
  { id: '4', title: 'School Holiday — Republic Day', message: 'The school will remain closed on January 26, 2026, on account of Republic Day. Classes will resume on January 27.', date: '2026-01-24', category: 'holiday', pinned: false, author: 'Admin Office' },
  { id: '5', title: 'Science Fair Registration Open', message: 'Students from classes 7-10 can register for the Inter-School Science Fair. Last date for registration is March 5, 2026.', date: '2026-02-22', category: 'event', pinned: false, author: 'Science Department' },
  { id: '6', title: 'Library Hours Extended', message: 'The school library will now be open until 5:00 PM on weekdays starting March 1, 2026. Students can use the library for exam preparation.', date: '2026-02-20', category: 'general', pinned: false, author: 'Librarian' },
];

const categoryStyles: Record<string, { color: string; bg: string; label: string }> = {
  general: { color: 'text-primary', bg: 'bg-primary/10', label: 'General' },
  exam: { color: 'text-warning', bg: 'bg-warning/10', label: 'Exam' },
  event: { color: 'text-info', bg: 'bg-info/10', label: 'Event' },
  holiday: { color: 'text-success', bg: 'bg-success/10', label: 'Holiday' },
};

const NoticeBoard = () => {
  const [filter, setFilter] = useState<'all' | string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', message: '', category: 'general' });
  const filtered = filter === 'all' ? notices : notices.filter(n => n.category === filter);
  const pinnedNotices = filtered.filter(n => n.pinned);
  const otherNotices = filtered.filter(n => !n.pinned);

  const handleAddNotice = () => {
    if (newNotice.title && newNotice.message) {
      setShowAddModal(false);
      setNewNotice({ title: '', message: '', category: 'general' });
      alert('Notice added successfully!');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notice Board</h1>
          <p className="text-muted-foreground">Official notices and announcements from the school</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Notice
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'general', 'exam', 'event', 'holiday'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
            {f === 'all' ? 'All Notices' : f}
          </button>
        ))}
      </div>

      {/* Pinned Notices */}
      {pinnedNotices.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><Pin className="h-4 w-4 text-primary" /> Pinned</h3>
          {pinnedNotices.map(notice => {
            const cat = categoryStyles[notice.category];
            return (
              <div key={notice.id} className="rounded-xl border-2 border-primary/20 bg-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{notice.title}</h3>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cat.bg} ${cat.color}`}>{cat.label}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{notice.message}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{notice.date}</span>
                  <span>By: {notice.author}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Other Notices */}
      <div className="space-y-3">
        {pinnedNotices.length > 0 && otherNotices.length > 0 && (
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><Bell className="h-4 w-4 text-muted-foreground" /> Recent</h3>
        )}
        {otherNotices.map(notice => {
          const cat = categoryStyles[notice.category];
          return (
            <div key={notice.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{notice.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cat.bg} ${cat.color}`}>{cat.label}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{notice.message}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{notice.date}</span>
                <span>By: {notice.author}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Add Notice</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
                <input value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} placeholder="Enter notice title" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
                <select value={newNotice.category} onChange={e => setNewNotice({ ...newNotice, category: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="general">General</option>
                  <option value="exam">Exam</option>
                  <option value="event">Event</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message *</label>
                <textarea value={newNotice.message} onChange={e => setNewNotice({ ...newNotice, message: e.target.value })} placeholder="Enter notice message" className="min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                <button onClick={handleAddNotice} className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Add Notice</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default NoticeBoard;
