const express = require('express');
const { getMatchById, getUserMatches, swipeUser, getUncompletedMatches, findNewUsers, getUserMatchIds, getFullMatchByIdForUser } = require('../controllers/matchController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/swipe', authMiddleware, swipeUser);
router.get('/', authMiddleware, getUncompletedMatches);
router.get('/new-users', authMiddleware, findNewUsers);
router.get('/user-matches', authMiddleware, getUserMatches);
router.get('/for-user', authMiddleware, getUserMatchIds);
router.get('/:matchId', authMiddleware, getMatchById);
router.get('/:matchId/full', authMiddleware, getFullMatchByIdForUser);

module.exports = router;