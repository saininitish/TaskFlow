import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validators';
import { validateRequest } from '../middleware/validate.middleware';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/me', protect, getMe);

export default router;
