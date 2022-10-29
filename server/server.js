const io = require('socket.io')(8080, {
    cors: {
        origin: ["http://localhost:8080"],
    },
})

io.on("connection" , socket => {
    console.log(socket.id)
})