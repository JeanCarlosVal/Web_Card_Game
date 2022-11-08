import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
import * as rules from '/js/games/poker/rules.js'

var slider = document.getElementById("myRange")
var output = document.getElementById("demo")
output.innerHTML = slider.value

slider.oninput = function () {
    output.innerHTML = this.value
}

window.onload = function () {
    document.getElementById("rooms").click();
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

var createRoom = document.getElementById("createRoom")
var seerooms = document.getElementById("rooms")

createRoom.addEventListener("click", e => {
    const room = document.getElementById("room").value

    poker.emit("create-room", room)
})

seerooms.addEventListener("click", e => {
    poker.emit("see-rooms")
    document.getElementById("rooms-table-body").innerHTML = ""
})

poker.on("fetched-rooms", response => {
    var rooms = Array.from(response)

    rooms.forEach(element => {
        poker.emit("check-room", element)
    });
})

poker.on('is-room-available', (availability, room, size) => {
    if (availability) {
        var tableBody = document.getElementById("rooms-table-body")

        var newRow = document.createElement('tr')

        var roomCell = document.createElement('td')
        var playersCell = document.createElement('td')
        var buttonCell = document.createElement('td')

        roomCell.innerText = room
        playersCell.innerText = size

        var joinbutton = document.createElement('button')

        joinbutton.id = room
        joinbutton.onclick = function () {
            join_game_lobby(room)
        }
        joinbutton.className = "join-room-button"
        joinbutton.innerText = "join"

        buttonCell.appendChild(joinbutton)

        newRow.appendChild(roomCell)
        newRow.appendChild(playersCell)
        newRow.appendChild(buttonCell)

        tableBody.appendChild(newRow)
    }
})

poker.on("create-status", (response, onlineId, room) => {
    if (response) {
        document.getElementById("createRoomDisplay").style.display = "none"
        document.getElementById("rooms-table").style.display = "none"
        document.getElementById("game").style.display = "block"

        document.getElementById("player").style.visibility = "visible"
        document.getElementById("player").id = onlineId
    }

    var game = document.getElementById("game")

    var html = game.outerHTML

    var data = { html: html }

    poker.emit("save-game-data", data, room)

})

function join_game_lobby(roomName) {
    poker.emit('join-game', roomName)
}

poker.on('joined-progress-game-status', (response, onlineId, data, room) => {
    if (response) {
        document.getElementById("createRoomDisplay").style.display = "none"
        document.getElementById("rooms-table").style.display = "none"

        document.getElementById("game-status").innerHTML = data.html

        document.getElementById("player").style.visibility = "visible"
        document.getElementById("player").id = onlineId

        var game = document.getElementById("game")

        var html = game.outerHTML

        var updatedData = { html: html }

        poker.emit("save-game-data", updatedData, room)
    }
})

poker.on('update-game', data => {
    console.log("updated")
    document.getElementById("game-status").innerHTML = data.html
})

poker.on('user-left', (id, room) => {
    document.getElementById(id).style.visibility = "hidden"
    document.getElementById(id).id = "player"

    var game = document.getElementById("game")

    var html = game.outerHTML

    var updatedData = { html: html }

    poker.emit("save-game-data", updatedData, room)
})