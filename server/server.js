const io = require('socket.io')(8080, {
    cors: {
        origin: ["http://localhost:3000"],
    },
})

const pokerIo = io.of("/poker")

io.on("connection" , socket => {
    console.log("root connection: " +socket.id)
})

pokerIo.on("connection" , socket => {
    console.log("poker connection: " +socket.id)
})