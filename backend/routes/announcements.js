import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { list, create } from '../controllers/announcementController.js';

const router = express.Router();
router.use(protect);
router.get('/', list);
router.post('/', authorize('Admin'), create);
export default router;
