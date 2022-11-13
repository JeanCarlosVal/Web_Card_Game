import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("http://localhost:8080/slap");

var roomName = document.getElementById("roomName");
var create = document.getElementById("createRoom");
var refresh = document.getElementById("refresh-rooms");
var availRooms = document.getElementById("available-rooms");

create.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('join-room', {room:roomName.value});
});

refresh.addEventListener("click", (e) => {
    console.log("click refresh");
    socket.emit("see-rooms");
    document.getElementById("available-rooms").innerHTML = "";
})

socket.on("fetched-rooms", response => {
    var rooms = Array.from(response);
    console.log(rooms);

    rooms.forEach(element => {
        socket.emit("check-room", element);
    });
})

socket.on('is-room-available', (pkg) => {
    if(pkg.availability){
        console.log("avail");
        var roomRow = document.createElement('tr');

        var roomName = document.createElement('td');
        roomName.innerText = pkg.roomName;

        var playerCount = document.createElement('td');
        playerCount.innerText = pkg.size;

        var join = document.createElement('td');
        var joinButton = document.createElement('button');
        joinButton.innerText = "Join " + pkg.roomName;
        joinButton.className = "join-room";
        join.appendChild(joinButton);

        roomRow.appendChild(roomName);
        roomRow.appendChild(playerCount);
        roomRow.appendChild(join);

        availRooms.appendChild(roomRow);
    }
})