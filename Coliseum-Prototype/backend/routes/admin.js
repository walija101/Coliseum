// routes/admin.js
const express = require('express');
const { viewAllRequests, approveRequest, declineRequest } = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/requests', authMiddleware, viewAllRequests);
router.post('/approve', authMiddleware, approveRequest);
router.post('/decline', authMiddleware, declineRequest);

module.exports = router;