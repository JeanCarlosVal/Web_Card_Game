module.exports = {
    lm,
    onConnect
}
const Slap = require('../games/slap/Slap.js');
const LobbyManager = require('../LobbyManager.js');

var lm;

function onConnect(socket, nsp) {
    lm = new LobbyManager(Slap, nsp, 8);
    console.log(`${socket} has made a connection to Slap.`)

    socket.on('join-random-lobby', (pkg) => {
        var lobby = lm.joinNewestLobby(socket, nsp);
        if (lobby) {
            nsp.to(lobby).emit('player-joined', {name:socket.id});
            socket.emit('successful-join', {message:"you've joined!"});
            console.log(socket.id + " has joined " + lobby);
        }
        else {
            console.log('alread joined');
        }
    });
    socket.on('join-said-lobby', (pkg) => {
        lm.joinSaidLobby(socket, nsp, pkg.lobbyid);
    });
    socket.on('create-lobby', (pkg) => {
        lm.createLobby(socket, nsp);
    });
    socket.on('leave-lobby', (pkg) => {
        lm.leaveLobby(socket, nsp, pkg.lobbyid);
    });
    socket.on('play', (pkg) => {
        var game = lm.getLobby(pkg.lobbyid);
        var room = nsp.adapter.rooms.get(pkg.lobbyid);
        if (pkg.action === 'slap') {
            game.play(socket.id, 'slap');
        }
        if (pkg.action === 'play') {
            game.play(socket.id, 'play');
        }
    });
}