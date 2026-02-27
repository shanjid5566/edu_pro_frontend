import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Modal = ({ open, onClose, title, description, children, size = 'md' }: ModalProps) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full ${sizeClasses[size]} rounded-xl border border-border bg-card shadow-2xl`}
        >
          <div className="flex items-start justify-between border-b border-border p-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default Modal;
