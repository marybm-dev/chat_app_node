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
    
    console.log(usernames);
    console.log(socket.username)
    if (!socket.username) {
        io.emit('usernames', usernames);
    }
    
    // fire disconnect event
    socket.on('disconnect', function (username) {
        if (!socket.username) return;

        delete usernames[socket.username];
        io.emit('disconnect', socket.username);
    });
    
    // display the chat message
    socket.on('chat message', function (user, msg) {
        io.emit('chat message', user, msg);
    });
    
    // display other news
    socket.on('news', function(data) {
       io.emit('news', data); 
    });

    // add the user to the users list
    socket.on('join', function(username) {
        if (!usernames[username]) {
            usernames[username] = socket.username = username;
            io.emit('join', username);
        }
    });
    
    // display all users currently connected
    socket.on('usernames', function(usernames) {
       io.emit('usernames', usernames); 
    });

});