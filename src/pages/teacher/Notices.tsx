import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Bell, Search, Pin, Calendar, User, Loader, ChevronRight } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchTeacherNotices,
  fetchPinnedNotices,
  fetchRecentNotices,
  searchNotices,
  fetchNoticeDetail,
  clearError,
  Notice,
} from '@/store/slices/teacherNoticesSlice';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/use-toast';

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  GENERAL: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'General' },
  EXAM: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Exam' },
  EVENT: { bg: 'bg-green-100', text: 'text-green-700', label: 'Event' },
  HOLIDAY: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Holiday' },
};

const priorityStyles: Record<string, { bg: string; text: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-700' },
  normal: { bg: 'bg-blue-100', text: 'text-blue-700' },
  high: { bg: 'bg-red-100', text: 'text-red-700' },
};

const TeacherNotices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { allNotices, pinnedNotices, recentNotices, selectedNotice, loading, detailLoading, error } = useSelector(
    (state: RootState) => state.teacherNotices,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pinned' | 'recent'>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Initialize - fetch pinned and recent notices
  useEffect(() => {
    dispatch(fetchPinnedNotices());
    dispatch(fetchRecentNotices(10));
    dispatch(fetchTeacherNotices({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchNotices(searchQuery));
    }
  };

  const handleNoticeClick = (notice: Notice) => {
    dispatch(fetchNoticeDetail(notice.id));
    setShowDetailModal(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedFilter('all');
    dispatch(fetchTeacherNotices({ page: 1, limit: 10 }));
  };

  const getDisplayNotices = (): Notice[] => {
    if (selectedFilter === 'pinned') return pinnedNotices;
    if (selectedFilter === 'recent') return recentNotices;
    return allNotices;
  };

  const displayNotices = getDisplayNotices();

  const renderNoticeCard = (notice: Notice) => {
    const categoryStyle = categoryColors[notice.category];
    const priorityStyle = priorityStyles[notice.priority];

    return (
      <motion.button
        key={notice.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => handleNoticeClick(notice)}
        className="w-full text-left rounded-lg border border-border bg-card p-4 hover:shadow-md transition-all hover:bg-secondary/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {notice.pinned && (
                <div className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  <Pin className="h-3 w-3" /> Pinned
                </div>
              )}
              <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryStyle.bg} ${categoryStyle.text}`}>
                {categoryStyle.label}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${priorityStyle.bg} ${priorityStyle.text}`}>
                {notice.priority}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1 truncate">{notice.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{notice.message}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {notice.author}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>
      </motion.button>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notices & Announcements</h1>
          <p className="text-muted-foreground">Stay updated with latest school announcements</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
          <Bell className="h-4 w-4" />
          {displayNotices.length}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-10 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
        {(searchQuery || selectedFilter !== 'all') && (
          <button
            type="button"
            onClick={clearSearch}
            className="h-10 px-4 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => {
            setSelectedFilter('all');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-secondary'
          }`}
        >
          All Notices
        </button>
        <button
          onClick={() => {
            setSelectedFilter('pinned');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
            selectedFilter === 'pinned'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-secondary'
          }`}
        >
          <Pin className="h-4 w-4" /> Pinned
        </button>
        <button
          onClick={() => {
            setSelectedFilter('recent');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'recent'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-secondary'
          }`}
        >
          Recent
        </button>
      </div>

      {/* Content */}
      {loading && displayNotices.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayNotices.length > 0 ? (
        <div className="grid gap-3">
          {displayNotices.map((notice, i) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {renderNoticeCard(notice)}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-1">No notices found</p>
          <p className="text-sm">Check back later for updates</p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
        }}
        title={selectedNotice?.title || 'Notice Detail'}
        size="lg"
      >
        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedNotice ? (
          <div className="space-y-4">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3">
              {selectedNotice.pinned && (
                <div className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  <Pin className="h-3 w-3" /> Pinned
                </div>
              )}
              <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryColors[selectedNotice.category].bg} ${categoryColors[selectedNotice.category].text}`}>
                {categoryColors[selectedNotice.category].label}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${priorityStyles[selectedNotice.priority].bg} ${priorityStyles[selectedNotice.priority].text}`}>
                {selectedNotice.priority}
              </span>
            </div>

            {/* Message */}
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{selectedNotice.message}</p>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 text-sm text-muted-foreground border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(selectedNotice.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div>
                  <p className="font-medium text-foreground">{selectedNotice.author}</p>
                  {selectedNotice.authorEmail && <p className="text-xs">{selectedNotice.authorEmail}</p>}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-4 h-10 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        ) : null}
      </Modal>
    </motion.div>
  );
};

export default TeacherNotices;
