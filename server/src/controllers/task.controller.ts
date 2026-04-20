import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: any, res: Response) => {
  try {
    const { status } = req.query;
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (status === 'completed') {
      query = query.eq('completed', true);
    } else if (status === 'pending') {
      query = query.eq('completed', false);
    }

    const { data: tasks, error } = await query;

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Map fields for frontend compatibility
    const mappedTasks = tasks.map((task: any) => ({
      ...task,
      _id: task.id,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));

    res.status(200).json({
      success: true,
      count: mappedTasks.length,
      tasks: mappedTasks,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;

    const { data: task, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          due_date: dueDate,
          user_id: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const mappedTask = {
      ...task,
      _id: task.id,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    };

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: mappedTask,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: any, res: Response) => {
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const mappedTask = {
      ...task,
      _id: task.id,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    };

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: mappedTask,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: any, res: Response) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/complete
// @access  Private
export const toggleComplete = async (req: any, res: Response) => {
  try {
    // First get current state
    const { data: task, error: getError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (getError || !task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const newCompleted = !task.completed;
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ success: false, message: updateError.message });
    }

    const mappedTask = {
      ...updatedTask,
      _id: updatedTask.id,
      dueDate: updatedTask.due_date,
      completedAt: updatedTask.completed_at,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
    };

    res.status(200).json({
      success: true,
      message: `Task marked as ${updatedTask.completed ? 'completed' : 'pending'}`,
      task: mappedTask,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
