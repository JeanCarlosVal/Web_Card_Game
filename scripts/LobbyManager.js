const RoomManager = require('./RoomManager.js');

module.exports = class LobbyManager {
    constructor(game, nsp, roomCap) {
        this.game = game;
        this.nsp = nsp;
        this.rm = new RoomManager(roomCap);
        this.lobbies = new Map(); // Map<lobbyid:String, lobby:Game>
        this.newestLobby = this.rm.newestRoom;
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
    joinSaidLobby() {

    }
    createLobby() {

    }
    leaveLobby() {

    }
    getLobby(lobbyid) {
        return this.lobbies.get(lobbyid);
    }

    // private
    generateRoomName() {
        var name = [];
        for (var i = 0; i < roomNameLength; i++) {
            name[i] = Math.floor(Math.random() * 10);
        }
        return name.join('');
    }
    joinNewestRoom(socket, nsp) {
        var newroom = this.rm.joinNewestRoom();
        // if joining prev made room
        if (!old) {
            this.lobbies.get(newestLobby).addPlayer(socket.id);
        }
        // create a new room and join it
        else {
            var newSlap = new this.game();
            newGame.addPlayer(socket.id);
            this.lobbies.set(newroom, newGame);
        }
    }
    joinRoom(socket, room) {
        if (this.rm.joinRoom(socket, room)) {
            this.lobbies.get(room).addPlayer(socket.id);
            return true; // success
        }
        else {
            return false; // no success
        }
    }
}