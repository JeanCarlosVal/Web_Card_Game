const io = require('socket.io')(8080, {
    cors: {
        origin: ["http://localhost:3000"],
    },
})

const pokerIo = io.of("/poker")

io.on("connection" , socket => {
    console.log("root connection: " +socket.id)
})

//When user connects do this
pokerIo.on("connection" , socket => {
    //When connected it automatically sets a room for the user using the user id this code below leaves it then it logs the user id
    socket.leave(socket.id)
    console.log("poker connection: " +socket.id)

    socket.on("join-room" , room => {
        socket.join(room)
        console.log(socket.id + " joined room: " + room)
        
    })

    socket.on("see-rooms", eval => {
        const rooms = Array.from(io.of("/poker").adapter.rooms.keys())
        console.log(io.of("/poker").adapter.rooms)

        socket.emit('fetched-rooms', rooms)
    })

    socket.on("check-room", room => {
        const map = io.of("/poker").adapter.rooms
        const users = Array.from(map.get(room))
        const roomSize = users.length
        console.log(room)

        if(users.length > 6){
            socket.emit('is-room-available', false, room, roomSize)
        }else{
            socket.emit('is-room-available', true, room, roomSize)
        }
    })
})

const slap = io.of('/slap'); // namespace
const Slap = require('./source/games/slap/Slap.js'); // game class
const LobbyManager = require('./source/LobbyManager.js');
var slapcap = 2;
var slaplm = new LobbyManager(Slap, slap, slapcap);
slap.on('connection', (socket)=> {
    console.log(`${socket.id} has made a connection to Slap.`);
    socket.on('create-lobby', (pkg) => {
        var lid = "lob:" + pkg.lobbyid;
        console.log(socket.id + " creating lobby " + pkg.lobbyid);
        var success = slaplm.createLobby(socket, "lob:" + pkg.lobbyid);
        if (success) {
            var game = slaplm.getLobby("lob:" + pkg.lobbyid);
            console.log(typeof game);
            game.addPlayer(socket.id);
            console.log("made lobby " + pkg.lobbyid);
            socket.emit("joined-lobby", {players:[socket.id], lobbyid:lid, yourid:socket.id});
        }
        else {
            console.log("failed to make lobby");
            socket.emit("error", success + " already exists!");
        }
    });
    socket.on('join-lobby', (pkg) => {
        console.log(socket.id + " wants to join " + pkg.lobbyid);
        var success = slaplm.joinLobby(socket, pkg.lobbyid);
        if (success) {
            console.log(socket.id + " joined lobby: " + pkg.lobbyid);
            var game = slaplm.getLobby(pkg.lobbyid);
            game.addPlayer(socket.id);
            var x = Array.from(slap.adapter.rooms.get(pkg.lobbyid));
            socket.emit('joined-lobby', {players:x, yourid:socket.id, lobbyid:pkg.lobbyid});
            socket.to(pkg.lobbyid).emit('player-join', {joiner:socket.id}); // socket.to sends to sender as well??
        }
        else {
            console.log("failed to join lobby");
        }

        // check if lobby is full
        if (slap.adapter.rooms.get(pkg.lobbyid).size == slapcap) {
            console.log("pkg.lobbyid " + pkg.lobbyid);
            var game = slaplm.getLobby(pkg.lobbyid);
            game.start();
            var cp = game.currentPlayer.socketid;
            slap.in(pkg.lobbyid).emit('game-prep', {});
            setTimeout(() => {
                slap.in(pkg.lobbyid).emit('game-start', {});
                slap.to(cp).emit('your-turn', {})
            }, 4000);
        }
    });
    socket.on('leave-lobby', (pkg) => {
        slaplm.leaveLobby(socket, slap, pkg.lobbyid);
    });  
    socket.on("see-lobbies", (pkg) => {
        console.log(socket.id + " request too see lobbies.");
        var allRooms = Array.from(slap.adapter.rooms.keys());
        var openRooms = [];
        allRooms.forEach((room) => {
            console.log(room);
            console.log(slap.adapter.rooms.get(room).size);
            console.log(room.startsWith("private"));
            // if you want a lobby to be private, start it with 'private'
            if (slap.adapter.rooms.get(room).size <= slapcap && room.startsWith("lob:") && !room.startsWith("prv:")) {
                console.log("INSIDE");
                openRooms.push(room);
            }
        });
        socket.emit('fetched-lobbies', openRooms);
    })
    socket.on("check-lobby", room => {
        if (room == null || room == undefined) {
            console.log("bad room has been found.")
            return;
        }
        console.log("checking room: " + room);
        const map = slap.adapter.rooms;
        const users = Array.from(map.get(room));
        const roomSize = users.length;
        if (roomSize >= 8) {
            console.log("unavailable");
            socket.emit('is-room-available', {availability:false,roomName:room,size:roomSize});
        }
        else {
            console.log("available");
            socket.emit('is-room-available', {availability:true,roomName:room,size:roomSize});
        }
    })
    socket.on('put', (pkg) => {
        console.log(socket.id + " put down a card.")
        var lobby = slaplm.getLobby(pkg.lobbyid);
        lobby.play("put", socket.id);
        socket.to(pkg.lobbyid).emit('enemy-put', {enemy:socket.id});
        console.log(lobby.currentPlayer.socketid);
        socket.to(lobby.currentPlayer.socketid).emit('your-turn');
    });
    socket.on('slap', (pkg) => {
        console.log(socket.id + " slapped the deck!");
        var lobby = slaplm.getLobby(pkg.lobbyid);
        var result = lobby.play("slap", socket.id);
        if (result == 'good') {
            socket.to(pkg.lobbyid).emit('enemy-first', {});
            socket.emit('you-first', {});
        }
        else if (result == 'slow') {
            socket.emit('too-slow', {});
        }
        else if (result == 'bad') {
            socket.to(pkg.lobbyid).emit('enemy-bad-slap', {});
            socket.emit('bad-slap', {});
        }
        slap.to(pkg.lobbyid).emit('game-state-change', {});
    });

});

