import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Edit3, CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Task } from '../../types/task.types';
import { useTasks } from '../../context/TaskContext';
import { cn } from '../shared/Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleTaskComplete, deleteTask } = useTasks();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group p-6 rounded-3xl glass shadow-lg transition-all duration-300 border border-slate-700/50 hover:border-primary-500/30",
        task.completed && "opacity-75 grayscale-[0.5]"
      )}
    >
      <div className="flex items-start gap-5">
        <button
          onClick={() => toggleTaskComplete(task._id)}
          className={cn(
            "mt-1 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-75",
            task.completed 
              ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" 
              : "border-2 border-slate-700 text-slate-700 hover:border-primary-500/50 hover:text-primary-500"
          )}
        >
          {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-lg font-bold text-white transition-all duration-300 truncate",
            task.completed && "line-through text-slate-500 decoration-2"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={cn(
              "mt-1.5 text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium transition-all duration-300",
              task.completed && "text-slate-600"
            )}>
              {task.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4">
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-colors",
                isOverdue 
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                  : "bg-slate-800/50 text-slate-400 border-slate-700/50"
              )}>
                {isOverdue ? <Clock size={14} /> : <Calendar size={14} />}
                {formatDate(task.dueDate)}
              </div>
            )}
            
            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-90"
                title="Edit Task"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-90"
                title="Delete Task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
