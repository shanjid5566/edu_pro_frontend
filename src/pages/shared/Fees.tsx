import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Calendar, FileText, Loader, TrendingUp } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchStudentFees,
  fetchFeesSummary,
  fetchFeesByType,
  fetchFeesTimeline,
  fetchUpcomingFees,
  fetchOverdueFees,
  filterFeesByStatus,
  clearError,
  Fee,
} from '@/store/slices/studentFeesSlice';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/use-toast';

type FeeStatus = 'all' | 'paid' | 'pending' | 'overdue' | 'partial';

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  paid: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Paid' },
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  overdue: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Overdue' },
  partial: { icon: Clock, color: 'text-info', bg: 'bg-info/10', label: 'Partial' },
};

const Fees = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { allFees, summary, byType, timeline, upcoming, overdue, filtered, loading, error } = useSelector(
    (state: RootState) => state.studentFees,
  );

  const [filter, setFilter] = useState<FeeStatus>('all');
  const [receiptModal, setReceiptModal] = useState<Fee | null>(null);

  // Initialize - fetch all fees data
  useEffect(() => {
    const loadFees = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudentFees()).unwrap(),
          dispatch(fetchFeesSummary()).unwrap(),
          dispatch(fetchFeesByType()).unwrap(),
          dispatch(fetchFeesTimeline(10)).unwrap(),
          dispatch(fetchUpcomingFees()).unwrap(),
          dispatch(fetchOverdueFees()).unwrap(),
        ]);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err || 'Failed to load fees',
          variant: 'destructive',
        });
      }
    };

    loadFees();
  }, [dispatch, toast]);

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

  // Handle filter change
  const handleFilterChange = (newFilter: FeeStatus) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      dispatch(filterFeesByStatus('all'));
    } else {
      dispatch(filterFeesByStatus(newFilter));
    }
  };

  if (loading && !summary) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fees & Payments</h1>
        <p className="text-muted-foreground">Track your fee payments and download receipts</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold text-success">₹{summary.totalPaid.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-xl font-bold text-warning">₹{summary.pendingAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-xl font-bold text-foreground">{summary.totalRecords}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Alert */}
      {overdue && overdue.count > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {overdue.count} overdue fee{overdue.count !== 1 ? 's' : ''}: ₹{overdue.totalPaid.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground">Please pay the outstanding amount as soon as possible.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'paid', 'pending', 'overdue'] as const).map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
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

      {/* Fee Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Fee Type</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Period</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Due Date</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fee) => {
                const config = statusConfig[fee.status];
                const Icon = config.icon;
                return (
                  <tr key={fee.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{fee.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{fee.period}</td>
                    <td className="px-4 py-3 font-medium text-foreground">₹{fee.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(fee.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {fee.status === 'paid' && fee.receiptNo && (
                        <button
                          onClick={() => setReceiptModal(fee)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" /> Receipt
                        </button>
                      )}
                      {fee.status !== 'paid' && (
                        <span className="text-xs text-muted-foreground">
                          {fee.status === 'pending' ? 'Awaiting payment' : 'Overdue'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-1">No fees found</p>
          <p className="text-sm">No fees matching your filter</p>
        </div>
      )}

      {/* Upcoming Fees Section */}
      {upcoming && upcoming.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Upcoming Fees</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.slice(0, 4).map((fee) => (
              <div key={fee.id} className="rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground">{fee.type}</h3>
                  <span className="text-xs font-medium text-info bg-info/10 rounded px-2 py-1">{fee.period}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{fee.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">₹{fee.amount.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-muted-foreground">
                    Due: {new Date(fee.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <Modal open={!!receiptModal} onClose={() => setReceiptModal(null)} title="Payment Receipt" size="sm">
        {receiptModal && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Receipt No</span>
                <span className="font-mono font-medium text-foreground">{receiptModal.receiptNo || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee Type</span>
                <span className="font-medium text-foreground">{receiptModal.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium text-foreground">{receiptModal.period}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-foreground">₹{receiptModal.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid On</span>
                <span className="font-medium text-foreground">
                  {receiptModal.paidDate
                    ? new Date(receiptModal.paidDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-success font-medium">Paid ✓</span>
              </div>
            </div>
            <button className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Fees;
