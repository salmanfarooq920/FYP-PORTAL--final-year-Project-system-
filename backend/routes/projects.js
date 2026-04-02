import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import {
  submitProposal,
  getMyProposals,
  getProposalsToReview,
  list,
  getOne,
  approveProposal,
  rejectProposal,
  assignSupervisor,
  getMyGroup,
  getProgress,
} from '../controllers/projectController.js';

const router = express.Router();
router.use(protect);

router.get('/my-group', getMyGroup);
router.get('/progress', authorize('Admin'), getProgress);
router.get('/my-proposals', authorize('Student'), getMyProposals);
router.get('/to-review', authorize('Mentor', 'Admin'), getProposalsToReview);
router.get('/', authorize('Admin', 'Mentor'), list);
router.get('/:id', getOne);
router.post('/', authorize('Student'), submitProposal);
router.patch('/:id/approve', authorize('Mentor', 'Admin'), approveProposal);
router.patch('/:id/reject', authorize('Mentor', 'Admin'), rejectProposal);
router.patch('/:id/supervisor', authorize('Admin'), assignSupervisor);

export default router;
