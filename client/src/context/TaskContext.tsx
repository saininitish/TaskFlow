import React, { createContext, useContext, useState, useCallback } from 'react';
import type { TaskState, CreateTaskInput, UpdateTaskInput, FilterType } from '../types/task.types';
import axiosInstance from '../api/axiosInstance';
import { useNotification } from './NotificationContext';

interface TaskContextType extends TaskState {
  fetchTasks: () => Promise<void>;
  addTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  setFilter: (filter: FilterType) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showNotification } = useNotification();
  const [state, setState] = useState<TaskState>({
    tasks: [],
    isLoading: false,
    error: null,
    activeFilter: 'all',
  });

  const fetchTasks = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await axiosInstance.get('/tasks');
      if (response.data.success) {
        setState(prev => ({
          ...prev,
          tasks: response.data.tasks,
          isLoading: false,
        }));
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch tasks',
      }));
    }
  }, []);

  const addTask = async (taskInput: CreateTaskInput) => {
    try {
      const response = await axiosInstance.post('/tasks', taskInput);
      if (response.data.success) {
        setState(prev => ({
          ...prev,
          tasks: [response.data.task, ...prev.tasks],
        }));
        showNotification('Task added successfully', 'success');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add task';
      showNotification(message, 'error');
      throw new Error(message);
    }
  };

  const updateTask = async (id: string, updates: UpdateTaskInput) => {
    try {
      const response = await axiosInstance.put(`/tasks/${id}`, updates);
      if (response.data.success) {
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t._id === id ? { ...t, ...response.data.task } : t),
        }));
        showNotification('Task updated successfully', 'success');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update task';
      showNotification(message, 'error');
      throw new Error(message);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t._id !== id),
      }));
      showNotification('Task deleted', 'info');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete task';
      showNotification(message, 'error');
      throw new Error(message);
    }
  };

  const toggleTaskComplete = async (id: string) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${id}/complete`);
      if (response.data.success) {
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t._id === id ? { ...t, ...response.data.task } : t),
        }));
        showNotification(response.data.message || 'Task status updated', 'success');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to toggle task';
      showNotification(message, 'error');
      throw new Error(message);
    }
  };

  const setFilter = (filter: FilterType) => {
    setState(prev => ({ ...prev, activeFilter: filter }));
  };

  return (
    <TaskContext.Provider value={{
      ...state,
      fetchTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      setFilter
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
