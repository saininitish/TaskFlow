export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string | null;
  dueDate?: string | null;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export type FilterType = 'all' | 'pending' | 'completed';

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  activeFilter: FilterType;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
}
