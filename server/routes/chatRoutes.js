const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

router.post('/send', chatController.addMessage);
router.get('/get', chatController.getMessages);

module.exports = router;