'use strict';

var socketio = require('socket.io'),
    io,
    currentRoom = {};

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
}

function handleGroupJoining(socket) {
    socket.on('join', function(group) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, group.group);
    });
}

function handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.group).emit('message', {
            text: message.user+': ' + message.text
        });
    });
}

function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {

    });
}

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        joinRoom(socket, 'Home');
        handleMessageBroadcasting(socket);
        handleGroupJoining(socket);
        handleClientDisconnection(socket);
    });
};