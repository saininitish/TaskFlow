import React from 'react';
import { useTasks } from '../../context/TaskContext';
import type { FilterType } from '../../types/task.types';
import { cn } from '../shared/Button';

const TaskFilter: React.FC = () => {
  const { activeFilter, setFilter, tasks } = useTasks();

  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: 'All Tasks', value: 'all', count: tasks.length },
    { label: 'Pending', value: 'pending', count: tasks.filter(t => !t.completed).length },
    { label: 'Completed', value: 'completed', count: tasks.filter(t => t.completed).length },
  ];

  return (
    <div className="flex p-1.5 bg-slate-800/50 rounded-2xl border border-slate-700/50 w-full md:w-fit">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={cn(
            "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3",
            activeFilter === f.value
              ? "bg-[#1e293b] text-white shadow-xl ring-1 ring-slate-700/50"
              : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/30"
          )}
        >
          {f.label}
          <span className={cn(
            "px-2 py-0.5 rounded-lg text-[10px] font-black leading-tight",
            activeFilter === f.value ? "bg-primary-500 text-white" : "bg-slate-700 text-slate-400"
          )}>
            {f.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
