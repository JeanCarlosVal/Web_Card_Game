module.exports = class RoomManager {
    constructor(cap) {
        this.roomNameLength = 10;
        this.newestRoom = this.generateRoomName();
        this.newestRoomCount = 0;
        this.roomCap = cap;
    }
    generateRoomName() {
        var name = [];
        for (var i = 0; i < this.roomNameLength; i++) {
            name[i] = Math.floor(Math.random() * 10);
        }
        return name.join('');
    }
    /*
    Returns name of room joined
    */
    joinNewestRoom(socket) {
        // if this socket is already in a game room, return
        console.log(socket.rooms);
        if (socket.rooms.size == 2) {
            return '';
        }
        try {
            // TODO: fox this
            if (io.of('/').adapter.rooms.get(this.newestRoom).has(socket.id)) {
                console.log(io.of('/').adapter.rooms.get(this.newestRoom).has(socket.id));
                return '';
            }
        }
        // this catches if .get() is undefined, meaning the room hasn't been joined yet
        catch (e) {
            console.log("room not yet there.");
        }
        socket.join(this.newestRoom);
        var oldroom = this.newestRoom;
        this.newestRoomCount++;
        if (this.newestRoomCount == this.roomCap) {
            this.newestRoom = this.generateRoomName();
            this.newestRoomCount = 0;
        }
        return this.newestRoom;
    }
    joinRoom(socket, room) {
        if (io.of('/').adapter.rooms.get(room).size == cap) {
            return "Room Full";
        }
        else {
            socket.join(room);
            newestRoomCount++;
        }
    }
}