// routes/mod.js
const express = require('express');
const { createRequest, createWarning, waitForChat } = require('../controllers/modController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/request', authMiddleware, createRequest);
router.post('/warning', authMiddleware, createWarning);
router.get('/wait-for-chat', authMiddleware, waitForChat);

module.exports = router;