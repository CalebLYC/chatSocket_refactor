var express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', '..', 'app', 'index.html'));
})

router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'chat.html'));
})

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'register.html'));
})

router.delete('/logout', (req, res)=>{
    var username = req.cookies.username;
    //connectedUsers = connectedUsers.filter(user => user.username != username)
    res.status(200).json({success: true, username});
})

module.exports = router;