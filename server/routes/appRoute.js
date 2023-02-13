var express = require('express');
const router = express.Router();
const path = require('path');
const getUser = require('../models/user').getUser;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', '..', 'app', 'index.html'));
})

router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'app', 'chat.html'));
    const id = req.query.id;
    /*getUser(id)
        .then(user => {
            return res.status(200).json({success: true, user});
        })
        .catch(err => {
            return res.status(500).json({sucess: false, message: err.message})
        })*/
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