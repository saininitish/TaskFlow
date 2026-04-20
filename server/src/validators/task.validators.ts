import { body } from 'express-validator';

export const taskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date format'),
];
