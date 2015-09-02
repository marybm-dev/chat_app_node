// dependencies
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    usernames = {};

// set heroku environment port
server.listen(process.env.PORT || 5000);

// set transport
io.set("transports",["websocket"]);

// app route
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

// Socket IO server
io.on('connection', function (socket) {
    // fire connection event
    socket.on('connect', function(username) {
        if (!usernames[username]) {
            io.emit('connect', username + ' connected');
            usernames[username] = socket.username = username;
        }
    });
    
    // fire disconnect event
    socket.on('disconnect', function () {
        io.emit('disconnect', 'user disconnected');
    });
    
    // display the chat message
    socket.on('chat message', function (user, msg) {
        io.emit('chat message', user, msg);
    });
    
    socket.on('news', function(data) {
       io.emit('news', data); 
    });
    
});