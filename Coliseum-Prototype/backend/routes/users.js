// routes/users.js
const express = require('express');
const { getProfile, getUserProfile, updateProfile, getUser, createProfile, getAllUsers, getAllUsersWithProfiles } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createUser } = require('../middlewares/signup')
const { getNotifications } = require('../controllers/notification')
const router = express.Router();

router.get('/user', authMiddleware, getUser)
router.get('/profile', authMiddleware, getProfile);
router.post('/userProfile', authMiddleware, getUserProfile);
router.patch('/profile', authMiddleware, updateProfile);
router.post('/profile', authMiddleware, createProfile);
router.post('/signup', createUser)  //no middleware if creating new user
router.get('/notification', authMiddleware, getNotifications)
router.get('/all-users', authMiddleware, getAllUsers);
router.get('/all-users-with-profiles', authMiddleware, getAllUsersWithProfiles);

module.exports = router;
