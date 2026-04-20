import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
} from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';
import { taskValidator } from '../validators/task.validators';
import { validateRequest } from '../middleware/validate.middleware';

const router = express.Router();

router.use(protect); // All task routes are protected

router.route('/')
  .get(getTasks)
  .post(taskValidator, validateRequest, createTask);

router.route('/:id')
  .put(taskValidator, validateRequest, updateTask)
  .delete(deleteTask);
router.patch('/:id/complete', toggleComplete);

export default router;
