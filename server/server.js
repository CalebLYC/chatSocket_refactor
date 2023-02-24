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

app.use(express.static(path.join(__dirname, '..', 'app'), { 
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
      }
    }
}));
app.use(express.json());

app.use(function(req, res, next){
    req.io = io;
    next();
});

const eventHandlers = require('./events/eventHandlers');
const appRoutes = require('./routes/appRoute');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use(appRoutes);
app.use(userRoutes);
app.use('/chat', chatRoutes);

const user = require('./models/user');
const chat= require('./models/chat');
const chatsTable = require('./models/chatsTable');
const connectedUsersModel = require('./models/connectedUser');
user.createUserTable();
//chat.createChatTable();
chatsTable.createChatsTable();
connectedUsersModel.createConnectedUsersTable();



io.on('connection', function(socket){
    socket.on('new user', (username) => eventHandlers.newUserHandler(socket, io, username));
    socket.on('user disconnect', (user)=>eventHandlers.userDisconnectHandler(socket, io, user));
    socket.on('chat message', (msg) => eventHandlers.chatMessageHandler(io, msg));
    socket.on('users', (user) => eventHandlers.usersHandler(io, user));
    socket.on('user login', (user)=>eventHandlers.userLogin(socket, user));
})

http.listen(3000, function(){
    console.log('Server running on 3000');
})