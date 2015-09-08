var host = location.origin;
var socket = io.connect(host, {port: 5000, transports: ["websocket"]});
var userLoggedIn = false
var user = ''

// server receives event as chat message
$('form').submit(function(){
    if (userLoggedIn && $('#input').val() != '') {
        socket.emit('chat message', user, $('#input').val());
    }
    $('#input').val('');
    return false;
});

// display when a user has connected
socket.on('connect', function(){
    // get the user's name and clear the placeholder
    // so the input box can now be used for chat messages
    var getUsername = function(callback) {
        callback($('#input').val());
        $('#input').removeAttr('placeholder');
    };
    
    // let everyone know who joined the chat
    $('#input').keypress(function(event) {
        if ( (event.which == 13) && !userLoggedIn ) {
            getUsername(function(username) {
                socket.emit('news', '... ' + username + ' connected ...');
                socket.emit('join', username);
                $('#input').val('');
                userLoggedIn = true;
                user = username
            });
        }
    });
});

// display when a user has disconnected
// remove from the users list
socket.on('disconnect', function(username){
    $('li').filter(function() { return $.text([this]) === username; }).remove();
    $('#messages').append($('<li>').text(' ... ' + username + ' disconnected ...'));
});

// add chat message to list
socket.on('chat message', function(user, msg){
    console.log(msg);
    $('#messages').append($('<li>').text(user + ': ' + msg));
});

// allow to display other events in the messages box
socket.on('news', function(data){
    $('#messages').append($('<li>').text(data));
});

// add the user to the users list
socket.on('join', function(username){
    $('#users').append($('<li>').text(username));
});

// display all currently connected users
socket.on('usernames', function (usernames){
    // make sure we aren't duplicating the entries first
    if (Object.keys(usernames).length != $('#users li').length) {
        for (var i in usernames) {
        $('#users').append($('<li>').text(usernames[i]));
        }
    }
});