const express = require('express');
const { approveMatch, denyMatch } = require('../controllers/approvalController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/approve', authMiddleware, approveMatch);
router.post('/deny', authMiddleware, denyMatch);

module.exports = router;