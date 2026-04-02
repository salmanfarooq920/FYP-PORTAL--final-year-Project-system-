import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { upload, list, getUrl } from '../controllers/fileController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage });

router.use(protect);
router.post('/upload', uploadMiddleware.single('file'), upload);
router.get('/', list);
router.get('/:id/url', getUrl);
export default router;
