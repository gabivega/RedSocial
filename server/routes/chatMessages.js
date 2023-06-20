import express from 'express';
import chatController from '../controllers/chatMessage.js';

const router = express.Router()

router.post('/saveChatMessages', chatController.saveChatMessages);
router.get('/getChatMessages', chatController.getChatMessages);

export default router;