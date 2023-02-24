const express = require('express');
const router = express.Router();
const path = require("path");

const chatController = require('../controllers/chatController');

router.post('/send', chatController.addMessage);
router.get('/get', chatController.getMessages);
router.get('/getChats', chatController.getChats);
router.get('/create', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'createChat.html'));
})
router.delete('/delete', chatController.deleteChat);

router.post('/create', chatController.createChat);

module.exports = router;