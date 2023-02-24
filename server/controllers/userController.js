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

const userModel = require('../models/user');
const chatsTableModel = require('../models/chatsTable');
const connectedUserModel = require('../models/connectedUser');

exports.getUsers = (req, res) => {
    userModel.getUsers()
        .then(users => {
            return res.status(200).json({success: true, users});
        })
        .catch(err => {
            return res.status(500).json({success: false, message: err.message});
        });
}

exports.createUser = (req, res) => {
    const {username, password, passwordConfirm} = req.body;
    if(password === passwordConfirm){
        userModel.addUser({username, password})
            .then(user => {
                res.status(200).json({success: true, user});
            })
            .catch(err => {
                res.status(500).json({success: false, message: err.message});
            })
    }else{
        res.status(500).json({success: false, message: "Les mots de passe ne correspondent pas"});
    }
}

exports.connect = (req, res) => {
    const {username, chatId} = req.body;
    userModel.userExists(username)
        .then(data => {
            if(data.exists){
                chatsTableModel.getChat(chatId)
                    .then((response)=>{
                        if(response.exists){
                            user = {
                                userInfos: data.user,
                                chat: response.chat
                            }
                            res.cookie('username', username);
                            res.status(200).json({success: true, user});
                        }
                    }).catch(err=>{
                        console.log(err.message);
                    })
            }else{
                res.status(500).json({success: false, message: 'Identifiant invalide'});
            }
        })
        .catch(err => {
            res.status(500).json({success: false, message: err.message});
        })
}

exports.login = (req, res) => {
    const {username, password} = req.body;
    userModel.userExists(username)
        .then(data => {
            if(data.exists){
                if(data.user.password === password){
                    res.cookie('user', data.user);
                    res.status(200).json({success: true, user:data.user});
                }
            }else{
                res.status(500).json({success: false, message: 'Identifiant invalide'});
            }
        })
        .catch(err => {
            res.status(500).json({success: false, message: err.message});
        })
}

exports.updateUser = (req, res) => {
    const { username, password } = req.body;
    const { id } = req.params;
    userModel.updateUser({id, username, password})
        .then(()=>{
            return res.status(200).json({ success: true, message: `Utilisateur ${id} mis à jour.` });
        })
        .catch((err)=>{
            return res.status(500).json({ success: false, message: err.message });
        })
};
  
  exports.deleteUser = (req, res) => {
    const { id } = req.params;
    userModel.deleteUser(id)
        .then(()=>{
            return res.status(200).json({ success: true, message: `Utilisateur ${id} supprimé.` });
        })
        .catch((err)=>{
            return res.status(500).json({ success: false, message: err.message });
        })
  };

  exports.logout = (req, res)=>{
    if(!req.body || !req.body.user){
        return res.status(400).json({success: false, message: "Cette session utilisateur est inavlide"})
    }
    var user = req.body.user;
    connectedUserModel.deleteConnectedUser(user.user_id)
        .then(()=>{
            res.status(200).json({success: true, user});
        }).catch(err=>{
            res.status(500).json({success: false, message:err.message});
        })
}