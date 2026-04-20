import React, { useState, useEffect } from 'react';
import type { CreateTaskInput, Task } from '../../types/task.types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { useTasks } from '../../context/TaskContext';
import { Type, AlignLeft, Calendar } from 'lucide-react';

interface TaskFormProps {
  taskToEdit?: Task | null;
  onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addTask, updateTask } = useTasks();

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : '');
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const taskData: CreateTaskInput = {
      title,
      description,
      dueDate: dueDate || undefined,
    };

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, taskData);
      } else {
        await addTask(taskData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Task Title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        icon={<Type size={20} />}
        required
        autoFocus
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400 ml-1">Description</label>
        <div className="relative group">
          <div className="absolute left-4 top-4 text-slate-500 group-focus-within:text-primary-500 transition-colors">
            <AlignLeft size={20} />
          </div>
          <textarea
            placeholder="Add details (optional)"
            className="w-full bg-[#1e293b]/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3 outline-none transition-all duration-200 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 placeholder:text-slate-600 glass-dark min-h-[120px] resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <Input
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        icon={<Calendar size={20} />}
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium italic">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <Button 
          type="submit" 
          isLoading={isSubmitting} 
          className="flex-1 h-12"
        >
          {taskToEdit ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
