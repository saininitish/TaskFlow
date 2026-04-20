import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';
import { cn } from './Button';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="text-emerald-400" size={20} />,
    error: <AlertCircle className="text-rose-400" size={20} />,
    warning: <AlertTriangle className="text-amber-400" size={20} />,
    info: <Info className="text-primary-400" size={20} />,
  };

  const colors = {
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100',
    error: 'border-rose-500/20 bg-rose-500/10 text-rose-100',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-100',
    info: 'border-primary-500/20 bg-primary-500/10 text-primary-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={cn(
        "pointer-events-auto flex items-center gap-3 p-4 rounded-2xl glass shadow-2xl border min-w-[300px] max-w-md",
        colors[type]
      )}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="flex-1 text-sm font-semibold leading-snug">
        {message}
      </p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
