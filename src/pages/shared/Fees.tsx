import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, XCircle, Download, Calendar, FileText } from 'lucide-react';
import Modal from '@/components/ui/Modal';

type FeeStatus = 'paid' | 'pending' | 'overdue';

interface FeeRecord {
  id: string;
  type: string;
  period: string;
  amount: number;
  dueDate: string;
  status: FeeStatus;
  paidDate?: string;
  receiptNo?: string;
}

const feeRecords: FeeRecord[] = [
  { id: '1', type: 'Monthly Tuition', period: 'February 2026', amount: 2500, dueDate: '2026-02-05', status: 'paid', paidDate: '2026-02-03', receiptNo: 'REC-2026-0215' },
  { id: '2', type: 'Monthly Tuition', period: 'January 2026', amount: 2500, dueDate: '2026-01-05', status: 'paid', paidDate: '2026-01-04', receiptNo: 'REC-2026-0142' },
  { id: '3', type: 'Monthly Tuition', period: 'March 2026', amount: 2500, dueDate: '2026-03-05', status: 'pending' },
  { id: '4', type: 'Quarterly Exam Fee', period: 'Q3 (Jan-Mar 2026)', amount: 800, dueDate: '2026-01-10', status: 'paid', paidDate: '2026-01-08', receiptNo: 'REC-2026-0089' },
  { id: '5', type: 'Half-Yearly Exam Fee', period: 'H2 2025-2026', amount: 1500, dueDate: '2026-03-01', status: 'pending' },
  { id: '6', type: 'Yearly Exam Fee', period: '2025-2026', amount: 2000, dueDate: '2026-04-01', status: 'pending' },
  { id: '7', type: 'Monthly Tuition', period: 'December 2025', amount: 2500, dueDate: '2025-12-05', status: 'paid', paidDate: '2025-12-10', receiptNo: 'REC-2025-1198' },
  { id: '8', type: 'Quarterly Exam Fee', period: 'Q2 (Oct-Dec 2025)', amount: 800, dueDate: '2025-10-10', status: 'paid', paidDate: '2025-10-09', receiptNo: 'REC-2025-0876' },
];

const statusConfig: Record<FeeStatus, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  paid: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Paid' },
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  overdue: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Overdue' },
};

const Fees = () => {
  const [filter, setFilter] = useState<'all' | FeeStatus>('all');
  const [receiptModal, setReceiptModal] = useState<FeeRecord | null>(null);

  const filtered = filter === 'all' ? feeRecords : feeRecords.filter(f => f.status === filter);
  const totalPaid = feeRecords.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = feeRecords.filter(f => f.status === 'pending' || f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fees & Payments</h1>
        <p className="text-muted-foreground">Track your fee payments and download receipts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2.5"><CreditCard className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-xl font-bold text-success">${totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2.5"><Clock className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-xl font-bold text-warning">${totalPending.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><FileText className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-xl font-bold text-foreground">{feeRecords.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'paid', 'pending', 'overdue'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Fee Table */}
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
            {filtered.map(fee => {
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
                  <td className="px-4 py-3 font-medium text-foreground">${fee.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fee.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
                      <Icon className="h-3.5 w-3.5" />{config.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {fee.status === 'paid' && (
                      <button onClick={() => setReceiptModal(fee)} className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                        <Download className="h-3.5 w-3.5" /> Receipt
                      </button>
                    )}
                    {fee.status === 'pending' && (
                      <span className="text-xs text-muted-foreground">Awaiting payment</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      <Modal open={!!receiptModal} onClose={() => setReceiptModal(null)} title="Payment Receipt" size="sm">
        {receiptModal && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Receipt No</span><span className="font-mono font-medium text-foreground">{receiptModal.receiptNo}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fee Type</span><span className="font-medium text-foreground">{receiptModal.type}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Period</span><span className="font-medium text-foreground">{receiptModal.period}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-bold text-foreground">${receiptModal.amount.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Paid On</span><span className="font-medium text-foreground">{receiptModal.paidDate}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><span className="text-success font-medium">Paid ✓</span></div>
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
