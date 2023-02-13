var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cookieParser())

app.use(express.static(path.join('..', 'app')));
app.use(express.json());

app.use(function(req, res, next){
    req.io = io;
    next();
});

exports.connectedUsers = [];
var Connecteduser;

const eventHandlers = require('./events/eventHandlers');
const appRoutes = require('./routes/appRoute');
const userRoutes = require('./routes/userRoutes');

app.use(appRoutes);
app.use(userRoutes);

const user = require('./models/user');
user.createUserTable();


io.on('connection', function(socket){
    socket.on('new user', (username) => eventHandlers.newUserHandler(socket, io, username));
    socket.on('user disconnect', (user)=>eventHandlers.userDisconnectHandler(socket, io, user));
    socket.on('chat message', (msg) => eventHandlers.chatMessageHandler(io, msg));
    socket.on('users', () => eventHandlers.usersHandler(io));
})

http.listen(3000, function(){
    console.log('Server running on 3000');
})