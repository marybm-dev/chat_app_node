var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', function (socket) {
      // fire connection event
    socket.broadcast.emit('user connected');
    
    // fire disconnect event
    socket.on('disconnect', function () {
        io.emit('disconnect', 'user disconnected');
    });
    
    // display the chat message
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});

//var WebSocketServer = require("ws").Server
//var http = require("http")
//var express = require("express")
//var app = express()
//var port = process.env.PORT || 5000
//
//app.use(express.static(__dirname + "/index.html"))
//
//var server = http.createServer(app)
//server.listen(port)
//
//console.log("http server listening on %d", port)
//
//var wss = new WebSocketServer({server: server})
//console.log("websocket server created")
//
//wss.on("connection", function(ws) {
//  var id = setInterval(function() {
//    ws.send(JSON.stringify(new Date()), function() {  })
//  }, 1000)
//
//  console.log("websocket connection open")
//
//  ws.on("close", function() {
//    console.log("websocket connection close")
//    clearInterval(id)
//  })
//})



//var app = require('express')();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);    // initializes new instance of socket.io
//
//app.get('/', function (req, res) {
//    res.sendFile(__dirname + '/index.html');
//});
//
//io.on('connection', function(socket) {
//    // fire connection event
//    socket.broadcast.emit('user connected');
//    
//    // fire disconnect event
//    socket.on('disconnect', function () {
//        io.emit('disconnect', 'user disconnected');
//    });
//    
//    // display the chat message
//    socket.on('chat message', function (msg) {
//        io.emit('chat message', msg);
//    });
//});
//
//io.emit('some event', { for: 'everyone' });
//
//http.listen(3000, function () {
//	console.log('listening on *:3000');
//});