import express from 'express';
import { protect } from '../middleware/auth.js';
import { getConversations, getMessages, createConversation, sendMessage } from '../controllers/chatController.js';

const router = express.Router();
router.use(protect);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);
export default router;
