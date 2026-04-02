import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { get, update } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', protect, get);
router.put('/', protect, authorize('Admin'), update);
router.patch('/', protect, authorize('Admin'), update);

export default router;
