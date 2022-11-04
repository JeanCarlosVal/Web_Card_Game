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
        console.log("joined room: " + room)
        
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