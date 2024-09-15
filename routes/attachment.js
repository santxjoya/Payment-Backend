const express = require('express');
const router = express.Router();
const AttachmentController = require('../controllers/attachmentController');

router.post('/upload', AttachmentController.uploadAttachment);

module.exports = router;
