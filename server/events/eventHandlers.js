var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Evènement d'envoi d'e connexion d'un nouvel utilisateur
const newUserHandler = (socket, user) => {
    socket.emit('redirect', `/chat?id=${user.id}`);
    socket.broadcast.emit('new user', {message: "Nouvel utilisateur connecté", username: user.username});
    /*io.emit('users', connectedUsers);
    socket.emit('users', connectedUsers);*/
}

//Evènement de déconnexion d'un utilisateur
const userDisconnectHandler = (socket, username) => {
    socket.emit('disconnect redirect', '/')
    //io.emit('users', connectedUsers);
    socket.broadcast.emit('user disconnect', {message: "Un utilisateur s'est déconnecté", username});
}

//Evènement d'envoi d'un message
const chatMessageHandler = (io, msg) => {
    io.emit('chat message', msg);
}

module.exports = {
    newUserHandler,
    userDisconnectHandler,
    chatMessageHandler,
}