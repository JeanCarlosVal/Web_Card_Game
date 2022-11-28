const io = require('socket.io')(8080, {
    cors: {
        origin: ["http://localhost:3000"],
    },
})

let pokerIo = io.of("/poker")

let rooms_data = {}

let players = []

let rooms_players = {}

let decks = []

let rooms_decks = {}

let rooms_players_playing = []

let player_bet = {}

let rooms_players_hand = []

//When user connects do this
pokerIo.on("connection", socket => {

    //Decides which player is playing 
    function playerRotation(players) {
        players.push(players.shift())

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

    })

    socket.on("join-room", room => {
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
        delete player_bet[socket.id]
        clearInterval(checkGameStart)
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                var deletedUser = players.filter(function (element) {
                    return element.playerId != socket.id
                })
                players = deletedUser

                rooms_players[room] = filterPlayers(players, room)

                pokerIo.to(room).emit('user-left', socket.id, room)

                var deleted_hands = rooms_players_hand.filter(function (element) {
                    return element.id != socket.id
                })


                rooms_players_hand = deleted_hands
            }

        }
    })

    function minimumPlayers(room) {
        const checkPlayers = Array.from(rooms_players[room])
        if (checkPlayers.length > 1) {
            console.log("game started in room: " + room)
            rooms_players_playing[room] = rooms_players[room]
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
        rooms_players_playing[room] = playerRotation(rooms_players_playing[room])

        if (firstPlayer != rooms_players_playing[room][0]) {
            const card_1 = rooms_decks[room][0].pop()
            const card_2 = rooms_decks[room][0].pop()

            socket.to(room).emit('new-hand', card_1, card_2, room, rooms_players_playing[room][0])
        } else {
            socket.to(room).emit('start-round', room)
        }

    })

    socket.on('next-player', (room, starting_player, firstThree, raise) => {
        rooms_players_playing[room] = playerRotation(rooms_players_playing[room])

        player_bet[socket.id] = raise

        socket.to(room).emit('post-raise', raise)

        if (starting_player != rooms_players_playing[room][0]) {
            socket.to(room).emit('player-turn', rooms_players_playing[room][0])
        } else {
            var raise_check = false

            if (raise_check == false) {
                for (let i = 0; i < rooms_players_playing[room].length; i++) {
                    const element = rooms_players_playing[room][i];

                    if (player_bet[element] != raise) {
                        raise_check = false
                        socket.to(room).emit('player-turn', rooms_players_playing[room][0])
                        break
                    } else {
                        raise_check = true
                    }
                }
            }
            if (raise_check) {

                if (firstThree) {
                    rooms_players_playing[room] = playerRotation(rooms_players_playing[room])

                    const table_card1 = rooms_decks[room][0].pop()
                    const table_card2 = rooms_decks[room][0].pop()
                    const table_card3 = rooms_decks[room][0].pop()

                    socket.to(room).emit('first-betting-round', table_card1, table_card2, table_card3, false, rooms_players_playing[room], rooms_players_playing[room][0])

                } else {
                    var raise_check = false

                    if (raise_check == false) {
                        for (let i = 0; i < rooms_players_playing[room].length; i++) {
                            const element = rooms_players_playing[room][i];
                            
                            if (player_bet[element] != raise) {
                                raise_check = false
                                socket.to(room).emit('player-turn', rooms_players_playing[room][0])
                                break
                            } else {
                                raise_check = true
                            }
                        }
                    }

                    if (raise_check) {
                        rooms_players_playing[room] = playerRotation(rooms_players_playing[room])

                        const table_card = rooms_decks[room][0].pop()

                        socket.to(room).emit('start-new-betting-round', rooms_players_playing[room][0], rooms_players_playing[room], table_card)
                    }
                }
            }
        }
    })

    socket.on('player-folded', (room, id, starting_player, firstThree, raise) => {
        players = Array.from(rooms_players_playing[room])

        const updatedPLayers = players.filter(function (element) {
            return element != id
        })
        rooms_players_playing[room] = updatedPLayers

        player_bet[socket.id] = raise
        socket.to(room).emit('post-raise', raise)

        if (starting_player != rooms_players_playing[room][0]) {
            if(starting_player == socket.id){
                socket.to(room).emit('change-starting-player', rooms_players_playing[room][0] )
            }
            socket.to(room).emit('player-turn', rooms_players_playing[room][0])
        } else {
            var raise_check = false

            if (raise_check == false) {
                for (let i = 0; i < rooms_players_playing[room].length; i++) {
                    const element = rooms_players_playing[room][i];

                    if (player_bet[element] != raise) {
                        raise_check = false
                        socket.to(room).emit('player-turn', rooms_players_playing[room][0])
                        break
                    } else {
                        raise_check = true
                    }
                }
            }
            if (raise_check) {

                if (firstThree) {
                    rooms_players_playing[room] = playerRotation(rooms_players_playing[room])

                    const table_card1 = rooms_decks[room][0].pop()
                    const table_card2 = rooms_decks[room][0].pop()
                    const table_card3 = rooms_decks[room][0].pop()

                    socket.to(room).emit('first-betting-round', table_card1, table_card2, table_card3, false, rooms_players_playing[room], rooms_players_playing[room][0])

                } else {
                    var raise_check = false

                    if (raise_check == false) {
                        for (let i = 0; i < rooms_players_playing[room].length; i++) {
                            const element = rooms_players_playing[room][i];

                            if (player_bet[element] != raise) {
                                raise_check = false
                                socket.to(room).emit('player-turn', rooms_players_playing[room][0])
                                break
                            } else {
                                raise_check = true
                            }
                        }
                    }

                    if (raise_check) {
                        rooms_players_playing[room] = playerRotation(rooms_players_playing[room])

                        const table_card = rooms_decks[room][0].pop()

                        socket.to(room).emit('start-new-betting-round', rooms_players_playing[room][0], rooms_players_playing[room], table_card)
                    }
                }
            }
        }
    })

    socket.on('submit-hand', (playerHand, assignedRoom) => {
        rooms_players_hand.push({ "room": assignedRoom, "id": socket.id, "hand": playerHand })
        socket.emit('done-submiting-hands')
    })

    socket.on('find-winner', room => {
        console.log(rooms_players_hand)

        const playerHands = {
            "Royal_Flush": 10,
            "Straight_Flush": 9,
            "Four_of_a_Kind": 8,
            "Full_House": 7,
            "Flush": 6,
            "Straight": 5,
            "Three_of_a_Kind": 4,
            "Two_Pair": 3,
            "One_Pair": 2,
            "High_Card": 1
        }

        const hands = Object.keys(playerHands)

        var players_highest_hand = {}

        const current_hands = rooms_players_hand.filter(function (element) {
            return element.room == room
        })

        for (let i = 0; i < current_hands.length; i++) {
            const playerHand = current_hands[i];
            var highestHand = 0
            hands.forEach(key => {
                if (playerHand.hand[key] != 0) {
                    const value = playerHands[key]
                    if (value > highestHand) {
                        highestHand = value
                    }
                }
            })
            players_highest_hand[playerHand.id] = highestHand
        }

        var playerKeys = Object.keys(players_highest_hand)

        var highestscore = 0

        playerKeys.forEach(key => {
            const score = players_highest_hand[key]
            if (score > highestscore) {
                highestscore = score
            }
        })

        var winner_hand = Object.keys(playerHands).find(key => playerHands[key] === highestscore)

        socket.to(room).emit('winner_hand', winner_hand)
    })

    socket.on('reset-players-and-cards', room => {
        socket.to(room).emit('reset', rooms_players[room])
    })

    socket.on('start-again', room => {
        const checkPlayers = Array.from(rooms_players[room])
        rooms_players_playing[room] = rooms_players[room]
        socket.to(room).emit('start-game', true, checkPlayers[0], room)
    })

    socket.on('send-pot', (pot, room) => {

        socket.to(room).emit('update-pot', pot)
    })
})

const slap = io.of('/slap'); // namespace
const Slap = require('./source/games/slap/Slap.js'); // game class
const LobbyManager = require('./source/LobbyManager.js');
var slapcap = 2;
var slaplm = new LobbyManager(Slap, slap, slapcap);
slap.on('connection', (socket) => {
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
            socket.emit("joined-lobby", { players: [socket.id], lobbyid: lid, yourid: socket.id });
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
            socket.emit('joined-lobby', { players: x, yourid: socket.id, lobbyid: pkg.lobbyid });
            socket.to(pkg.lobbyid).emit('player-join', { joiner: socket.id }); // socket.to sends to sender as well??
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
            socket.emit('is-room-available', { availability: false, roomName: room, size: roomSize });
        }
        else {
            console.log("available");
            socket.emit('is-room-available', { availability: true, roomName: room, size: roomSize });
        }
    });
    socket.on('chat-message', (pkg) => {
        console.log("chat message: " + pkg.message + pkg.lobbyid);
        slap.to(pkg.lobbyid).emit("chat-message", {sender:pkg.sender, message:pkg.message});
    });
    socket.on('put', (pkg) => {
        console.log(socket.id + " put down a card.")

        var lobby = slaplm.getLobby(pkg.lobbyid);
        lobby.play("put", socket.id);
        var cardPut = lobby.deck.getTop(0).toString();
        socket.to(pkg.lobbyid).emit('enemy-put', { enemy: socket.id, card: cardPut });
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


const crazy8 = io.of('/crazy8'); // namespace
const Crazy8 = require('./source/games/crazy8/Crazy8.js'); // game class
var c8cap = 2;
var c8lm = new LobbyManager(Crazy8, crazy8, c8cap);
crazy8.on('connection', (socket)=> {
    console.log(`${socket.id} has made a connection to Crazy8.`);
    socket.on('create-lobby', (pkg) => {
        var lid = "lob:" + pkg.lobbyid;
        console.log(socket.id + " creating lobby " + pkg.lobbyid);
        var success = c8lm.createLobby(socket, "lob:" + pkg.lobbyid);
        if (success) {
            var game = c8lm.getLobby("lob:" + pkg.lobbyid);
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
        var success = c8lm.joinLobby(socket, pkg.lobbyid);
        if (success) {
            console.log(socket.id + " joined lobby: " + pkg.lobbyid);
            var game = c8lm.getLobby(pkg.lobbyid);
            game.addPlayer(socket.id);
            var x = Array.from(crazy8.adapter.rooms.get(pkg.lobbyid));
            socket.emit('joined-lobby', {players:x, yourid:socket.id, lobbyid:pkg.lobbyid});
            socket.to(pkg.lobbyid).emit('player-join', {joiner:socket.id}); // socket.to sends to sender as well??
        }
        else {
            console.log("failed to join lobby");
        }

        // check if lobby is full
        if (crazy8.adapter.rooms.get(pkg.lobbyid).size == c8cap) {
            console.log("pkg.lobbyid " + pkg.lobbyid);
            var game = c8lm.getLobby(pkg.lobbyid);
            game.start();
            var cp = game.currentPlayer.socketid;
            crazy8.in(pkg.lobbyid).emit('game-prep', {});
            setTimeout(() => {
                crazy8.in(pkg.lobbyid).emit('game-start', {});
                crazy8.to(cp).emit('your-turn', {})
            }, 2500);
        }
    });
    socket.on('leave-lobby', (pkg) => {
        c8lm.leaveLobby(socket, crazy8, pkg.lobbyid);
    });  
    socket.on("see-lobbies", (pkg) => {
        console.log(socket.id + " request too see lobbies.");
        var allRooms = Array.from(crazy8.adapter.rooms.keys());
        var openRooms = [];
        allRooms.forEach((room) => {
            console.log(room);
            console.log(crazy8.adapter.rooms.get(room).size);
            console.log(room.startsWith("private"));
            // if you want a lobby to be private, start it with 'private'
            if (crazy8.adapter.rooms.get(room).size <= c8cap && room.startsWith("lob:") && !room.startsWith("prv:")) {
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
        const map = crazy8.adapter.rooms;
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

});
