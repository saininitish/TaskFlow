import React from 'react';
import { LogOut, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../shared/Button';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700/50 bg-[#0f172a]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-tight">
              Task<span className="text-primary-500">Flow</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
              Personal Productivity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <User size={18} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] text-slate-500 leading-none">{user?.email}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-2xl"
          >
            <LogOut size={18} className="mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
