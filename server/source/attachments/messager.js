module.exports = {
    onConnect
}

const RoomManager = require('../RoomManager.js');
var rm = new RoomManager(4);

function onConnect(socket, nsp) {
    console.log("Connection:" + socket.id);
    console.log(socket.eventNames);

    var rooms = nsp.rooms;

    socket.on('join-random-lobby', (packet) => {
        const success = rm.joinNewestRoom(socket);
        if (success) {
            console.log('socket: ' + socket.id + " has joined room: " + success);
            socket.to(success).emit('message-from-server', {msg:'New player joined.', newplayer:socket.id});
        }
        else {
            console.log('socket: ' + socket.id + ' attempted to join the room again.')
            socket.emit('already-joined-room', 'You have already joined this room.');
        }
        console.log(socket.rooms);
    });
    socket.on('join-said-room', (roomid) => {
        if (rooms.get(rooomid) == undefined) {
            socket.emit('room-not-found', 'The room you want to join was not there.');
        }
        else {
            socket.join(roomid);
            socket.emit('room-join-success', 'Welcome to the room!');
        }
    })
    socket.on('create-room', (packet) => {
        var newroom = rm.generateRoomName();
        socket.join(newroom);
        socket.emit('created-room', {msg:'room created', success:true, roomid:newroom});
    });
    socket.on('leave-room', (packet) => {
        var room = packet.room;
        if (rooms.has(room) && rooms.get(room).has(socket.id)) {
            socket.emit('leave-room-success', {msg:'Left room'});``
            socket.to(room).emit('message-from-server', {msg:socket.id + 'has left the room'});
            socket.leave(room);
        }
        else {
            socket.emit('leave-room-failure', {msg:'Cannot leave room you.'});
        }
    });
    socket.on('room-message', (packet) => {
        // TODO: sends to unneeded rooms (self room)
        console.log(packet.msg);
        socket.rooms.forEach((room) => {
            socket.to(room).emit('message-from-server', {sender:"null", msg:packet.msg});
        });
    });
}