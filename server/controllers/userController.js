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

exports.login = (req, res) => {
    const username = req.body.username;
    userModel.userExists(username)
        .then(data => {
            if(data.exists){
                res.cookie('username', username);
                res.status(200).json({success: true, user: data.user});
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