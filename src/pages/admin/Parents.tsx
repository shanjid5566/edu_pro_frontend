import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, Download, Eye, Pencil, Trash2, Mail, Phone, X } from 'lucide-react';

const mockParents = [
  { id: '1', name: 'Michael Johnson', email: 'mjohnson@email.com', phone: '+1 555 0101', occupation: 'Engineer', students: ['Sarah Johnson'], address: '123 Oak St', status: 'active' as const },
  { id: '2', name: 'Robert Williams', email: 'rwilliams@email.com', phone: '+1 555 0102', occupation: 'Doctor', students: ['James Williams'], address: '456 Elm St', status: 'active' as const },
  { id: '3', name: 'Thomas Davis', email: 'tdavis@email.com', phone: '+1 555 0103', occupation: 'Lawyer', students: ['Emma Davis'], address: '789 Pine St', status: 'active' as const },
  { id: '4', name: 'Carlos Martinez', email: 'cmartinez@email.com', phone: '+1 555 0104', occupation: 'Architect', students: ['Liam Martinez'], address: '321 Cedar St', status: 'active' as const },
  { id: '5', name: 'David Brown', email: 'dbrown@email.com', phone: '+1 555 0105', occupation: 'Teacher', students: ['Olivia Brown'], address: '654 Maple St', status: 'active' as const },
  { id: '6', name: 'Steven Wilson', email: 'swilson@email.com', phone: '+1 555 0106', occupation: 'Business Owner', students: ['Noah Wilson'], address: '987 Birch St', status: 'inactive' as const },
];

const Parents = () => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newParent, setNewParent] = useState({ name: '', email: '', phone: '', occupation: '' });
  const filtered = mockParents.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  const handleAddParent = () => {
    if (newParent.name && newParent.email && newParent.phone) {
      setShowAddModal(false);
      setNewParent({ name: '', email: '', phone: '', occupation: '' });
      alert('Parent added successfully!');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parents</h1>
          <p className="text-muted-foreground">Manage parent accounts and student associations</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Parent
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search parents..." className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors"><Filter className="h-4 w-4" /> Filter</button>
        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-secondary transition-colors"><Download className="h-4 w-4" /> Export</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((parent, i) => (
          <motion.div key={parent.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warning/10 text-lg font-semibold text-warning">{parent.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-foreground">{parent.name}</p>
                  <p className="text-xs text-muted-foreground">{parent.occupation}</p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${parent.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{parent.status}</span>
            </div>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /><span className="text-foreground">{parent.email}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /><span className="text-foreground">{parent.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Children</span><span className="text-foreground">{parent.students.join(', ')}</span></div>
            </div>
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <button className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"><Eye className="mr-1 inline h-3.5 w-3.5" /> View</button>
              <button className="flex-1 rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"><Pencil className="mr-1 inline h-3.5 w-3.5" /> Edit</button>
              <button className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Parent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Add Parent</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                <input value={newParent.name} onChange={e => setNewParent({ ...newParent, name: e.target.value })} placeholder="Enter parent name" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                <input value={newParent.email} onChange={e => setNewParent({ ...newParent, email: e.target.value })} type="email" placeholder="Enter email address" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone *</label>
                <input value={newParent.phone} onChange={e => setNewParent({ ...newParent, phone: e.target.value })} placeholder="Enter phone number" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Occupation</label>
                <input value={newParent.occupation} onChange={e => setNewParent({ ...newParent, occupation: e.target.value })} placeholder="Enter occupation" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                <button onClick={handleAddParent} className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Add Parent</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Parents;
