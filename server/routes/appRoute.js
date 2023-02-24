var express = require('express');
var app = express();
const router = express.Router();
const path = require('path');

const getUser = require('../models/connectedUser').getConnectedUser;
const logout = require('../controllers/userController').logout;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', '..', 'app', 'index.html'));
})

router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'chat.html'));
})

router.get('/chats', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'chats.html'));
})

router.get('/user', (req, res) => {
    const id = req.query.id;
    getUser(id)
        .then(user => {
            return res.status(200).json({success: true, user: user.connectedUser});
        })
        .catch(err => {
            return res.status(500).json({sucess: false, message: err.message})
        })
})

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'register.html'));
})

router.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'login.html'));
})

router.delete('/logout', logout);

router.get('/chat/assets/css/style.css', function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'assets', 'css', 'style.css'));
  });
  router.get('/chat/assets/js/createChat.js', function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'assets', 'js', 'createChat.js'));
  });
  router.get('/chat/assets/js/chat.js', function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'assets', 'js', 'chat.js'));
  });
  

module.exports = router;