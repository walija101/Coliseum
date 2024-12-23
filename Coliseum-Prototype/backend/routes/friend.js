const express = require('express');
const {addFriend, sendFriendRequest, declineFriend, viewAllFriendRequests, getFriends, deleteFriend } = require('../controllers/friendController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

//should it be post?
router.post('/add', authMiddleware, addFriend)
router.post('/decline', authMiddleware, declineFriend)
router.post('/send', authMiddleware, sendFriendRequest)
router.get('/viewAll', authMiddleware, viewAllFriendRequests)
router.get('/friends', authMiddleware, getFriends)
router.delete('/delete', authMiddleware, deleteFriend)

module.exports = router;