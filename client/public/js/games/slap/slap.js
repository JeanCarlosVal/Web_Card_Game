import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("http://localhost:8080/slap");

// 3 displays
var prelobby = document.getElementById("pre-lobby");
var inlobby = document.getElementById("in-lobby");
var game = document.getElementById("game");

// prelobby tags (browsing for a lobby)
var roomName = document.getElementById("roomName");
var create = document.getElementById("createRoom");
var refresh = document.getElementById("refresh-rooms");
var availRooms = document.getElementById("available-rooms");

// inlobby tags (waiting for fill)
var players = document.getElementById("players-in-lobby");
var leave = document.getElementById("leave");

// in game tags (game in progess)
var slap = document.getElementById("slap");
var play = document.getElementById("play");

var yourid = null;
var yourlobby = null;


// prelobby events
create.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('create-lobby', {lobbyid:roomName.value});
});
refresh.addEventListener("click", (e) => {
    console.log("click refresh");
    socket.emit("see-lobbies");
    document.getElementById("available-rooms").innerHTML = "";
});
socket.on("fetched-lobbies", response => {
    var rooms = response;
    console.log("FECTCHED " + rooms);

    rooms.forEach(element => {
        socket.emit("check-lobby", element);
    });
});

// socket.io emissions handlers
socket.on('is-room-available', (pkg) => {
    console.log("avail");
    var roomRow = document.createElement('tr');

    var roomName = document.createElement('td');
    roomName.innerText = pkg.roomName;

    var playerCount = document.createElement('td');
    playerCount.innerText = pkg.size;

    var join = document.createElement('td');
    var joinButton = document.createElement('button');
    joinButton.innerText = "Join " + pkg.roomName;
    joinButton.className = "join-room-button";
    joinButton.setAttribute('data-room', pkg.roomName);
    joinButton.addEventListener('click', (e) => {
        var r = e.target.getAttribute('data-room');
        console.log("client joining lobby: " + r);
        socket.emit('join-lobby', {lobbyid:r});
    });
    join.appendChild(joinButton);

    roomRow.appendChild(roomName);
    roomRow.appendChild(playerCount);
    roomRow.appendChild(join);

    availRooms.appendChild(roomRow);
});

socket.on("player-leave", (pkg) => {
    console.log("player leave");
    var ps = Array.from(players.children);
    for (var i = 0; i < ps.length; i++) {
        if (ps[i].getAttribute('data-name') == pkg.leaver) {
            players.removeChild(ps[i]);
            break;
        }
    }
});

socket.on("player-join", (pkg) => {
    console.log('new player join: ' + pkg.joiner);
    var px = document.createElement("li");
    px.innerText = pkg.joiner;
    players.appendChild(px);
});

socket.on("joined-lobby", (pkg) => {
    // change displays
    prelobby.style.display = "none";
    inlobby.style.display = "block";

    // show players in the room
    var playerArr = pkg.players;
    console.log("joined lobby with: " + playerArr);
    playerArr.forEach((px) => {
        var pinfo = document.createElement("li");
        pinfo.innerText = px;
        players.appendChild(pinfo);
    });

    yourid = pkg.yourid;
    yourlobby = pkg.lobbyid;
});

//
// GAME INFORMATION
//

var isTurn = false;

socket.on('game-prep', (pkg) => {
    inlobby.style.display = "none";
    prep.style.display = "block";
});

socket.on('game-start', (pkg) => {
    console.log("game-started");
    prep.style.display = "none";
    game.style.display = "block";

    if (pkg.currentPlayer == yourid) {
        isTurn = true;
    }
});

socket.on('your-turn', (pkg) => {
    console.log("Your turn!");
    isTurn = true;
});

socket.on('enemy-first', (okg) => {
    console.log("Someone hit the deck!");
});

socket.on('you-first', (pkg) => {
    console.log("you slapped first!");
});

socket.on('too-slow', (pkg) => {
    console.log("Someone was faster than you!")
});

socket.on('bad-slap', (pkg) => {
    console.log("You slapped with no combo!");
});

slap.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('slap', {
        slapperid:yourid,
        lobbyid:yourlobby
    });
});

play.addEventListener('click', (e) => {
    if (!isTurn) {
        console.log("it's not ur turn!");
        return;
    }
    isTurn = false;
    e.preventDefault();
    socket.emit('put', {
        playerid:yourid,
        lobbyid:yourlobby
    });
});
