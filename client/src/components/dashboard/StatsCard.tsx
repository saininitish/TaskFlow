import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../shared/Button';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'info';
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color, delay = 0 }) => {
  const colors = {
    primary: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    info: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-6 rounded-3xl glass-dark border border-slate-700/50 flex items-center gap-5 group hover:border-slate-500/50 transition-colors"
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-300", colors[color])}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
