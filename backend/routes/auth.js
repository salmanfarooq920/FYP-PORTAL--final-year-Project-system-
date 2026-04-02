import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Public route for login
router.post('/login', login);

// Protected route for registration - only admins can create new users
router.post('/register', protect, authorize('Admin'), register);

export default router;
