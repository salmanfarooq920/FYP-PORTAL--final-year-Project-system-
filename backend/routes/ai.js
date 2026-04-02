import express from 'express';
import { protect } from '../middleware/auth.js';
import { evaluateIdea, getReports, saveReport } from '../controllers/aiController.js';

const router = express.Router();
router.use(protect);
router.post('/evaluate-idea', evaluateIdea);
router.get('/reports', getReports);
router.post('/reports', saveReport);
export default router;
