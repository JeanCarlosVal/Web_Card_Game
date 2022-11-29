import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { buildChatBox } from "/js/chatbox.js";
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
var deck = document.getElementById("deck");

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
    inlobby.style.display = "table-cell";

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

    buildChatBox(socket, yourid, yourlobby);
});

//
// GAME INFORMATION
//

var isTurn = false;
var numCards = 0;
var isLock = -1;

socket.on('game-prep', (pkg) => {
    inlobby.style.display = "none";
    prep.style.display = "table-cell";
});

socket.on('game-start', (pkg) => {
    prep.style.display = "none";
    game.style.display = "table-cell";

    if (pkg.currentPlayer == yourid) {
        isTurn = true;
    }

    newUpdate("Game Started.");
});

socket.on('your-turn', pkg => {
    isLock = pkg.isLock;
    isTurn = true;
});

// slapping results
socket.on('enemy-first', (pkg) => {
    console.log("someone hit the deck");

});
socket.on('you-first', (pkg) => {
    console.log("you slapped first!");
    numCards += pkg.deckSize;
});
socket.on('too-slow', (pkg) => {
    newUpdate("Someone was faster than you!");
});
socket.on('bad-slap', (pkg) => {
    newUpdate("You slapped with no combo!");
    numCards--;
});

socket.on('empty-deck', () => {
    deck.innerHTML = "";
});

socket.on('put', pkg => {
    isLock = false;
    if (pkg.putter === yourid) {
        console.log('you put');
    }
    else {
        console.log('enemy put');
    }
    if (pkg.rank) deck.innerHTML = pkg.rank + " of " + pkg.suite
    else deck.innerHTML = undefined;

});
// when the "grace period" stops
// 1. people cannot slap w/o consequences
socket.on('slap-time-off', pkg => {
    deck.innerHTML = null;
});

slap.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('slap', {
        slapperid:yourid,
        lobbyid:yourlobby
    });
});

play.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isTurn) {
        console.log("it's not ur turn!");
        return;
    }
    socket.emit('put', {
        playerid:yourid,
        lobbyid:yourlobby
    });
});

function newUpdate(text) {
    console.log(text);
}
