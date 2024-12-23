const express = require('express');
const { signIn } = require('../middlewares/login.js');
const { logOut } = require('../middlewares/logout.js');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', signIn)
router.post('/logout', authMiddleware, logOut);

module.exports = router;