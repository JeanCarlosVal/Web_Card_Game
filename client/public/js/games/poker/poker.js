import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
    }

var poker = io("http://localhost:8080/poker")

var check = document.getElementById("check")
var fold = document.getElementById("fold")
var raise = document.getElementById("raise")

check.addEventListener("click", e => {
    poker.emit("player-check")
})

fold.addEventListener("click", e => {
    poker.emit("player-fold")
})

raise.addEventListener("click", e => {
    poker.emit("player-raise")
})

var joinroom = document.getElementById("createRoom")
var seerooms = document.getElementById("rooms")

joinroom.addEventListener("click", e =>{
    const room = document.getElementById("room").value

    poker.emit("join-room", room)
})

seerooms.addEventListener("click", e => {
    poker.emit("see-rooms" )
    document.getElementById("available-rooms").innerHTML = "";
})

poker.on("fetched-rooms", response => {
    var rooms = Array.from(response)
    console.log(rooms)

    rooms.forEach(element => {
        poker.emit("check-room", element)
    });
})

poker.on('is-room-available', (availability, room, size) => {
    if(availability){
        var p = document.createElement('p')
        p.innerText = room + " current players: " + size
        p.className = 'room-name'
        document.getElementById("available-rooms").appendChild(p)
        var button = document.createElement('button')
        button.id = room
        button.className = 'join-room-button'
        document.getElementById("available-rooms").appendChild(button)
    }
})

