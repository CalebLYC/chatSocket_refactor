var express = require('express');
var app = express();
var http = require('http').Server(app);

let connectedUsers = require('../server').connectedUsers;

//Evènement d'envoi de connexion d'un nouvel utilisateur
const newUserHandler = (socket, io, user) => {
    userExist = false;
    connectedUsers.forEach(connUser => {
        if(connUser.id === user.id){
            userExist = true;
        }
    });
    !userExist && connectedUsers.push(user);
    socket.emit('redirect', `/chat?id=${user.id}`);
    socket.broadcast.emit('new user', {message: "Nouvel utilisateur connecté", user});
    /*io.emit('users', connectedUsers);
    socket.emit('users', connectedUsers);*/
}

//Evènement de déconnexion d'un utilisateur
const userDisconnectHandler = (socket, io, user) => {
    connectedUsers = connectedUsers.filter(connectedUser => connectedUser.id !== user.id);
    socket.emit('disconnect redirect', '/')
    io.emit('users', connectedUsers);
    socket.broadcast.emit('user disconnect', {message: "Un utilisateur s'est déconnecté", user});
}

//Evènement d'envoi d'un message
const chatMessageHandler = (io, message) => {
    require('../models/chat').getMessages().then(messages => {
        io.emit('chat message', messages);
    })
}

const usersHandler = (io) => {
    io.emit('users', connectedUsers);
}

module.exports = {
    newUserHandler,
    userDisconnectHandler,
    chatMessageHandler,
    usersHandler,
}