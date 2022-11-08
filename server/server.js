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

//When user connects do this
pokerIo.on("connection", socket => {
    //When connected it automatically sets a room for the user using the user id this code below leaves it then it logs the user id
    socket.leave(socket.id)
    console.log("poker connection: " + socket.id)

    socket.on("create-room", room => {
        try {
            socket.join(room)
            console.log("created and joined room: " + room)
            socket.emit("create-status", true, socket.id, room)
        } catch (error) {
            socket.emit("create-status", false)
        }
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
            console.log("joined room: "+roomName)
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
        console.log("user left")
        for (const room of socket.rooms) {
            if(room !== socket.id){
                console.log(room)
                pokerIo.to(room).emit('user-left', socket.id, room)
            }
        }
    })

})

