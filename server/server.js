const io = require('socket.io')(8080, {
    cors: {
        origin: ["http://localhost:3000"],
    },
})

let pokerIo = io.of("/poker")

io.on("connection", socket => {
    console.log("root connection: " + socket.id)
})

let rooms_data = {}

let players = []

let rooms_players = {}

let decks = []

let rooms_decks = {}

//When user connects do this
pokerIo.on("connection", socket => {

    //Decides which player is playing 
    function playerRotation(players) {
        var k = 1
        function reverse(arr, start, end) {
            while (start < end) {
                [arr[start], arr[end]] = [arr[end], arr[start]];
                start++;
                end--;
            }
        }

        k %= players.length;

        reverse(players, 0, (players.length - 1));
        reverse(players, 0, (k - 1));
        reverse(players, k, (players.length - 1));

        return players
    }

    //filter players array to assign players to each room, this is going to help to keep track of who is playing in the game 
    function filterPlayers(players, room) {
        var RoomPlayers = players.filter(function (element) {
            return element.room == room
        })

        var currentRoomPlayers = RoomPlayers.map(function (element) {
            return element.playerId
        })

        return currentRoomPlayers
    }

    let checkGameStart

    //When connected it automatically sets a room for the user using the user id this code below leaves it then it logs the user id

    socket.leave(socket.id)

    socket.emit("assign-id", socket.id)

    socket.on("create-room", room => {
        try {
            socket.join(room)

            checkGameStart = setInterval(function () {
                console.log("Checking if game can start in room: " + room)
                minimumPlayers(room)
            }, 10000)

            players.push({ "room": room, "playerId": socket.id })

            rooms_players[room] = filterPlayers(players, room)

            socket.emit("create-status", true, socket.id, room)
        } catch (error) {
            socket.emit("create-status", false)
        }
    socket.on("join-room" , room => {
        socket.join(room)
        console.log(socket.id + " joined room: " + room)
        
    })

    socket.on("see-rooms", eval => {
        const rooms = Array.from(io.of("/poker").adapter.rooms.keys())

        socket.emit('fetched-rooms', rooms)
    })

    socket.on("check-room", room => {
        const map = io.of("/poker").adapter.rooms
        const users = Array.from(map.get(room))
        const roomSize = users.length

        if (users.length > 5) {
            socket.emit('is-room-available', false, room, roomSize)
        } else {
            socket.emit('is-room-available', true, room, roomSize)
        }
    })

    socket.on('join-game', roomName => {
        try {
            socket.join(roomName)
            players.push({ "room": roomName, "playerId": socket.id })

            rooms_players[roomName] = filterPlayers(players, roomName)

            socket.emit("joined-progress-game-status", true, socket.id, rooms_data[roomName], roomName)
        } catch (error) {
            socket.emit("joined-progress-game-status", false)
        }
    })

    socket.on('save-game-data', (data, room) => {
        rooms_data[room] = data

        socket.to(room).emit('update-game', data)
    })

    socket.on('disconnecting', e => {
        clearInterval(checkGameStart)
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                var deletedUser = players.filter(function (element) {
                    return element.playerId != socket.id
                })
                players = deletedUser

                rooms_players[room] = filterPlayers(players, room)

                pokerIo.to(room).emit('user-left', socket.id, room)
            }

        }
    })

    function minimumPlayers(room) {
        const checkPlayers = Array.from(rooms_players[room])
        if (checkPlayers.length > 1) {
            console.log("game started in room: " + room)
            socket.to(room).emit('start-game', true, checkPlayers[0], room)
            clearInterval(checkGameStart)
        }
    }

    socket.on('store-deck', (deck, room) => {

        var clearedRoom = decks.filter(function (element) {
            return element.room != room
        })

        decks = clearedRoom

        decks.push({ "room": room, "deck": deck })

        var RoomCards = decks.filter(function (element) {
            return element.room == room
        })

        var currentRoomCards = RoomCards.map(function (element) {
            return element.deck
        })

        rooms_decks[room] = currentRoomCards
    })

    socket.on('give-cards-to-players', (firstPlayer, room) => {
        //rooms_decks[room] contains the array of cards under another array the first [0] is to access the cards array
        rooms_players[room] = playerRotation(rooms_players[room])

        if (firstPlayer != rooms_players[room][0]) {
            const card_1 = rooms_decks[room][0].pop()
            const card_2 = rooms_decks[room][0].pop()

            console.log("number of cards:" + rooms_decks[room][0].length)

            socket.to(room).emit('new-hand', card_1, card_2, room, rooms_players[room][0])
        } else {
            socket.to(room).emit('start-round', room)
        }

    })

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
        var cardPut = lobby.deck.getTop(0).toString();
        socket.to(pkg.lobbyid).emit('enemy-put', {enemy:socket.id, card:cardPut});
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

