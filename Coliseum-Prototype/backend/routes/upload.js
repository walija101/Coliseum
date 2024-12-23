const express = require('express');
const fileUpload = require('express-fileupload');
const { uploadImage, getTempLink } = require('../controllers/uploadController');

const router = express.Router();

router.use(fileUpload());

router.post('/upload', express.raw({ type: 'application/octet-stream', limit: '10mb' }), uploadImage);
router.get('/getImage', getTempLink);

module.exports = router;