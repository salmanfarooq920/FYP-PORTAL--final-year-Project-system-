import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import {
  list,
  create,
  getOne,
  update,
  remove,
  getForStudent,
  getSubmissions,
  submitMilestone,
  getSubmissionsToEvaluate,
  evaluate,
} from '../controllers/milestoneController.js';

const router = express.Router();
router.use(protect);

router.get('/', list);
router.get('/for-student', authorize('Student'), getForStudent);
router.get('/to-evaluate', authorize('Mentor', 'Admin'), getSubmissionsToEvaluate);
router.patch('/submissions/:id/evaluate', authorize('Mentor', 'Admin'), evaluate);
router.get('/:id', getOne);
router.get('/:id/submissions', getSubmissions);
router.post('/', authorize('Admin'), create);
router.post('/:id/submit', authorize('Student'), submitMilestone);
router.patch('/:id', authorize('Admin'), update);
router.delete('/:id', authorize('Admin'), remove);

export default router;
