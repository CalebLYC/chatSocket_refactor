var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = {
    express,
    app,
    http,
    io,
    path,
    cookieParser,
    bodyParser,
}