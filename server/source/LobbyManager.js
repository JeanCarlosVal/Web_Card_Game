const RoomManager = require('./RoomManager.js');
const Slap = require('./games/slap/Slap.js');

module.exports = class LobbyManager {
    constructor(game, nsp, roomCap) {
        this.game = game;
        this.nsp = nsp;
        this.rm = new RoomManager(nsp, roomCap);
        this.lobbies = new Map(); // Map<lobbyid:String, lobby:Game>
        this.newestLobby = this.rm.newestRoom;
        this.roomCap = roomCap;
    }
    // available to game-attachments
    joinNewestLobby(socket) {
        var room = this.rm.joinNewestRoom(socket);
        if (room) { // success
            var lobby = this.lobbies.get(room);
            if (lobby) { // already existing lobby
                lobby.addPlayer(socket.id);
            }
            else { // not yet existing lobby
                this.lobbies.set(room, new this.game);
                console.log(typeof this.lobbies.get(room));
                this.lobbies.get(room).addPlayer;
            }
        }
        return room;
    }
    joinLobby(socket, lobbyid) {
        console.log(this.nsp.adapter.rooms.get(lobbyid).size + " " + this.roomCap);
        if (this.nsp.adapter.rooms.get(lobbyid) == undefined) {
            console.log("The lobby requested does not exist");
            return false;
        }
        if (this.nsp.adapter.rooms.get(lobbyid).size == this.roomCap) {
            console.log("The lobby requested is full");
            return false;
        }
        socket.join(lobbyid);
        return true;

        // var success = this.rm.joinRoom(lobbyid);
        // if (success) {
        //     this.lobbies.get(lobbyid).addPlayer(socket.id);
        // }
    }
    createLobby(socket, lobbyName) {
        if (this.nsp.adapter.rooms.has(lobbyName)) {
            console.log("Already exists");
            return false;
        }
        socket.join(lobbyName);
        var newGame = new this.game();
        console.log("INSTANCEOF " + newGame instanceof Slap);
        this.lobbies.set(lobbyName, newGame); // does this even work??
        return true;
    }
    leaveLobby(socket, lobbyName) {
        this.rm.leaveRoom(socket, lobbyName);
        this.lobbies.get(lobbyName).removePlayer(socket.id);
    }
    // returns a ref to the game instance identified by the lobby
    getLobby(lobbyid) {
        return this.lobbies.get(lobbyid);
    }
}