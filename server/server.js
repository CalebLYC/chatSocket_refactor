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

app.use(function(req, res, next){
    req.io = io;
    next();
});

var connectedUsers = [];
var Connecteduser;

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '..', 'app', 'index.html'));
})

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'app', 'chat.html'));
});


app.post('/login', (req, res)=>{
    var username = req.body.username;
    getUsers()
        .then(users =>{
            let userExists = false;
            users.forEach(user => {
                if(user.username === username){
                    userExists = true;
                    Connecteduser = user
                }
            });
            if(userExists){
                res.cookie('username', username);
                connectedUsers.push(Connecteduser);
                res.status(200).json({ success: true, username });
            }else{
                res.status(200).json({success: false});
            }
        })
        .catch(err=> console.error(err))
})

app.get('/signin', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'app', 'signin.html'))
})

app.delete('/logout', (req, res)=>{
    var username = req.cookies.username;
    users = users.filter(user => user.username != username)
    res.status(200).json({success: true, username});
})


io.on('connection', function(socket){
    console.log("A user is connect");
    socket.on('new user', (username)=>{
        socket.emit('redirect', '/chat');
        socket.broadcast.emit('new user', {message: "Nouvel utilisateur connecté", username});
        io.emit('users', connectedUsers);
        socket.emit('users', connectedUsers);
    })
    socket.on('user disconnect', (username)=>{
        socket.emit('disconnect redirect', '/')
        io.emit('users', connectedUsers);
        socket.broadcast.emit('user disconnect', {message: "Un utilisateur s'est déconnecté", username});
    })
    socket.on('disconnect', function(){
        console.log("A user is disconnect")
    })
    socket.on('chat message', function(msg){
        console.log("Message reçu: " + msg);
        io.emit('chat message', msg);
    })
})

http.listen(3000, function(){
    console.log('Server running on 3000');
})

/*****************Base de données******************/
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./mydb.db',(err)=>{
    if(err){
        return console.error(err.message);
    }
    console.log("Connecté à la base de données sqlite");
})

app.post('/signin', (req, res)=>{
    data = req.body;
    if(data.password == data.passwordConfirm){
        id = Math.floor(Date.now());
        db.run(`INSERT INTO users(id, username, password) VALUES(?, ?, ?)`, [id, data.username, data.password], (err)=>{
            if(err){
                return console.error(err.message);
            }
            console.log('Utilisateur ajouté avec succès');
        });
        res.status(200).json({success: true});
    }
});

const getUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM USERS", (err, users) => {
            if(err){
                reject(err)
            }
            resolve(users)
        })
    })
}

process.on('SIGINT', () => {
    console.log('Closing database');
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database closed');
    });
    process.exit();
});

