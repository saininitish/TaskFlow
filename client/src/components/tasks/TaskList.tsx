import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import type { Task } from '../../types/task.types';
import { ClipboardList, PlusCircle } from 'lucide-react';
import Button from '../shared/Button';

interface TaskListProps {
  onEditTask: (task: Task) => void;
  onAddTask: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask, onAddTask }) => {
  const { tasks, activeFilter, isLoading } = useTasks();

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'pending') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-3xl bg-slate-800/40 animate-pulse border border-slate-700/50" />
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 text-center glass rounded-3xl border border-dashed border-slate-700"
      >
        <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500 mb-6">
          <ClipboardList size={40} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {activeFilter === 'all' 
            ? "No tasks yet" 
            : `No ${activeFilter} tasks found`}
        </h3>
        <p className="text-slate-400 max-w-xs mx-auto mb-8 font-medium">
          {activeFilter === 'all' 
            ? "Your workspace is empty. Start by adding a new task to stay organized!" 
            : `You don't have any tasks that match this filter.`}
        </p>
        
        {activeFilter === 'all' && (
          <Button onClick={onAddTask} className="h-12 px-8">
            <PlusCircle size={20} className="mr-2" />
            Create Your First Task
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode='popLayout'>
        {filteredTasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={onEditTask} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
