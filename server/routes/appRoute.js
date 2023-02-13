var express = require('express');
var app = express();
const router = express.Router();
const path = require('path');

const getUser = require('../models/user').getUser;
let connectedUsers = require('../server').connectedUsers;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', '..', 'app', 'index.html'));
})

router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'chat.html'));
})

router.get('/user', (req, res) => {
    const id = req.query.id;
    getUser(id)
        .then(user => {
            return res.status(200).json({success: true, user});
        })
        .catch(err => {
            return res.status(500).json({sucess: false, message: err.message})
        })
})

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'register.html'));
})

router.delete('/logout', (req, res)=>{
    if(!req.body || !req.body.user){
        return res.status(400).json({success: false, message: "Cette session utilisateur est inavlide"})
    }
    var user = req.body.user;
    connectedUsers = connectedUsers.filter(connectedUser => connectedUser.id !== user.id);
    res.status(200).json({success: true, user});
})

module.exports = router;