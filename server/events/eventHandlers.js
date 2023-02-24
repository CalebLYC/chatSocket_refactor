var express = require('express');
var app = express();
var http = require('http').Server(app);

let connectedUserModel = require('../models/connectedUser');
 
const newUserHandler = (socket, io, user) => {
    connectedUserModel.addConnectedUser({user_id: user.userInfos.id, username: user.userInfos.username, chat_id:user.chat.chat_id})
        .then(()=>{
            connectedUserModel.getConnectedUsers(user.chat.chat_id)
                .then(users=>{
                    socket.emit('redirect', `/chat?id=${user.userInfos.id}`);
                    socket.broadcast.emit('new user', {message: "Nouvel utilisateur connecté", user});
                    socket.emit('connected', user);
                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch(err=>{
            console.log(err);
        })
}

const userLogin = (socket, user) => {
    socket.emit('user login', user);
}


//Evènement de déconnexion d'un utilisateur
const userDisconnectHandler = (socket, io, user) => {
    connectedUserModel.getConnectedUsers(user.chat_id)
        .then(users=>{
            socket.emit('disconnect redirect', '/')
            io.emit('users', {id:user.chat_id, users});
            socket.broadcast.emit('user disconnect', {message: "Un utilisateur s'est déconnecté", user});
        })
}

//Evènement d'envoi d'un message
const chatMessageHandler = (io, data) => {
    const chat = data.chat;
    require('../models/chat').getMessages(chat).then(messages => {
        io.emit('chat message', messages);
    })
}

const usersHandler = (io, user) => {
    connectedUserModel.getConnectedUsers(user.chat_id)
        .then(users=>{
            io.emit('users', {id:user.chat_id, users:users});
        }).catch(err=>console.error(err))
}

module.exports = {
    newUserHandler,
    userDisconnectHandler,
    chatMessageHandler,
    usersHandler,
    userLogin,
}