// routes/chats.js
const express = require('express');
const { createChat, viewChat, sendMessage, getChatsByMatchIds, getFullChatById } = require('../controllers/chatController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createChat);
router.get('/:chatId', authMiddleware, viewChat);
router.post('/sendMessage', authMiddleware, sendMessage);
router.post('/for-matches', authMiddleware, getChatsByMatchIds);
router.get('/:chatId/full', authMiddleware, getFullChatById);

module.exports = router;
