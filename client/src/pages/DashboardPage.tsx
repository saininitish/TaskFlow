import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ListTodo, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import type { Task } from '../types/task.types';

// Components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCard from '../components/dashboard/StatsCard';
import TaskFilter from '../components/tasks/TaskFilter';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';

const DashboardPage: React.FC = () => {
  const { tasks, fetchTasks } = useTasks();
  const { user } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleModalClose = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-4 mt-12">
        {/* Welcome Section */}
        <section className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              Hello, <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">{user?.name}</span> 👋
            </h2>
            <p className="text-slate-400 font-medium text-xl">
              You have <span className="text-white font-bold">{pendingTasks}</span> pending tasks for today.
            </p>
          </motion.div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard label="Total Tasks" value={totalTasks} icon={ListTodo} color="info" delay={0.1} />
          <StatsCard label="Pending" value={pendingTasks} icon={AlertCircle} color="warning" delay={0.2} />
          <StatsCard label="Completed" value={completedTasks} icon={CheckCircle2} color="success" delay={0.3} />
          <StatsCard label="Progress" value={completionRate} icon={Plus} color="primary" delay={0.4} /> {/* value as % */}
        </section>

        {/* Workspace Toolbar */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="w-full md:w-auto">
            <h3 className="text-2xl font-black text-white mb-4 md:mb-0">Workspace</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TaskFilter />
            <Button onClick={handleAddTask} className="h-12 px-6 w-full md:w-auto shadow-xl shadow-primary-500/20">
              <Plus size={20} className="mr-2" />
              New Task
            </Button>
          </div>
        </section>

        {/* Task List */}
        <section>
          <TaskList onEditTask={handleEditTask} onAddTask={handleAddTask} />
        </section>
      </main>

      {/* Task Creation/Editing Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={handleModalClose}
        title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm 
          taskToEdit={taskToEdit} 
          onSuccess={handleModalClose} 
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
