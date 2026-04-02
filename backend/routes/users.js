import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { list, get, create, update, remove } from '../controllers/userController.js';

const router = express.Router();
router.use(protect);
router.use(authorize('Admin'));
router.get('/', list);
router.get('/:id', get);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);
export default router;
