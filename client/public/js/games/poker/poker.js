import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
import * as rules from '/js/games/poker/rules.js'

window.onload = function () {
    document.getElementById("rooms").click();
}

// let testHand = [
//     {"suit": "♦", "value": "A"},
//     {"suit": "♣", "value": "5"},
//     {"suit": "♦", "value": "K"},
//     {"suit": "♣", "value": "4"},
//     {"suit": "♦", "value": "Q"},
//     {"suit": "♦", "value": "J"},
//     {"suit": "♦", "value": "10"},
// ]

// rules.analyzeHand(testHand)

var assignedId

var idPlaying

let currentDeck = []

let raise = 0

let bet = 0

var startin_player

var assignedRoom

let firstThree = true

let hand = []

var poker = io("http://localhost:8080/poker")

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
//-----------------------------------------------------------------------------------------------------
//server listeners
poker.on("assign-id", id => {
    assignedId = id
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
        assignedRoom = room
        document.getElementById("createRoomDisplay").style.display = "none"
        document.getElementById("rooms-table").style.display = "none"
        document.getElementById("game").style.display = "block"
        document.getElementById("game-message").innerText = "Waiting for game to start...."
        document.getElementById("playerOptions").style.display = "block"

        assignPlayerHtml(onlineId)

    }

    updatePage(document.getElementById("game"), room)

})

function join_game_lobby(roomName) {
    poker.emit('join-game', roomName)
}

poker.on('joined-progress-game-status', (response, onlineId, data, room) => {
    if (response) {
        assignedRoom = room
        document.getElementById("createRoomDisplay").style.display = "none"
        document.getElementById("rooms-table").style.display = "none"
        document.getElementById("playerOptions").style.display = "block"

        document.getElementById("game-status").innerHTML = data.html

        assignPlayerHtml(onlineId)

        updatePage(document.getElementById("game"), room)
    }
})

poker.on('update-game', data => {
    document.getElementById("game-status").innerHTML = data.html
})

poker.on('user-left', (id, room) => {
    document.getElementById(id).style.visibility = "hidden"
    document.getElementById(id).id = "player"
    document.getElementById(id + "-status").id = "player-status"
    document.getElementById(id + "-chips").id = "player-chips"

    updatePage(document.getElementById("game"), room)
})

poker.on('start-game', (response, playerTurn, room) => {
    if (response) {
        document.getElementById("game-message").innerHTML = ""
        idPlaying = playerTurn

        currentDeck = rules.startRound()

        updatePage(document.getElementById("game"), room)

        if (idPlaying == assignedId) {
            const card1 = currentDeck.cards.pop()
            hand.push(card1)
            const card2 = currentDeck.cards.pop()
            hand.push(card2)

            renderHand(card1, card2)
            poker.emit('store-deck', currentDeck.cards, room)
            poker.emit('give-cards-to-players', idPlaying, room)
        }
    }
})

poker.on('new-hand', (card1, card2, room, player) => {
    if (player == assignedId) {
        renderHand(card1, card2)
        hand.push(card1)
        hand.push(card2)
        poker.emit('give-cards-to-players', idPlaying, room)
    }
})

poker.on('start-round', room => {
    document.getElementById('table-card-1').style.visibility = "visible"
    document.getElementById('table-card-2').style.visibility = "visible"
    document.getElementById('table-card-3').style.visibility = "visible"
    document.getElementById('table-card-4').style.visibility = "visible"
    document.getElementById('table-card-5').style.visibility = "visible"
    document.getElementById(idPlaying).style.borderColor = "yellow"

    updatePage(document.getElementById("game"), room)

    startin_player = idPlaying
})

poker.on('player-turn', player => {

    idPlaying = player
    document.getElementById(idPlaying).style.borderColor = "yellow"
    updatePage(document.getElementById("game"), assignedRoom)

})

poker.on('start-new-betting-round', (player, players, card) => {

    if (document.getElementById("table-card-5").innerText != "") {
        var handValue = rules.analyzeHand(hand)

        poker.emit('submit-hand', handValue, assignedRoom)
    } else {
        startin_player = player
        idPlaying = player

        if (idPlaying == assignedId) {
            clearRound(players, card)
        }
        hand.push(card)

        document.getElementById(idPlaying).style.borderColor = "yellow"

        updatePage(document.getElementById("game"), assignedRoom)
    }
})

poker.on('first-betting-round', (card1, card2, card3, firstRound, players, player) => {
    firstThree = firstRound
    startin_player = player
    idPlaying = player

    players.forEach(element => {
        document.getElementById(element + "-status").innerText = "Status"
        document.getElementById(element).style.borderColor = "gray"
    });

    if (idPlaying == assignedId) {
        render_firstThree_Cards(card1)
        render_firstThree_Cards(card2)
        render_firstThree_Cards(card3)
    }

    hand.push(card1)
    hand.push(card2)
    hand.push(card3)

    document.getElementById(idPlaying).style.borderColor = "yellow"

    updatePage(document.getElementById("game"), assignedRoom)
})

poker.on('post-raise', value => {
    raise = value
})

poker.on('done-submiting-hands', e => {
    if(idPlaying == assignedId){
        poker.emit('find-winner', assignedRoom)
    }
})

poker.on('winner_hand', winner_hand => {
    var handValue = rules.analyzeHand(hand)

    if(handValue[winner_hand] != 0){
        document.getElementById(assignedId+"-status").innerText = "Winner!!!"
        updatePage(document.getElementById("game"), assignedRoom)
        
    }
})
//------------------------------------------------------------------------------------------------------------------------------------------------------------------
//listeners for dynamic content in page
document.querySelector('body').addEventListener('click', function (e) {
    //only if its the turn of the player enable actions
    if (idPlaying == assignedId) {
        if (e.target.id == 'check') {
            if (raise == 0) {
                document.getElementById(assignedId + "-status").innerText = "Checked"
                document.getElementById(idPlaying).style.borderColor = "lightgreen"

                updatePage(document.getElementById("game"), assignedRoom)

                poker.emit('next-player', assignedRoom, startin_player, firstThree, raise)
            } else {
                document.getElementById(assignedId + "-status").innerText = "Call"
                document.getElementById(idPlaying).style.borderColor = "lightgreen"

                var chips = parseInt(document.getElementById(assignedId + "-chips").innerText)

                bet = (raise - bet)

                chips -= bet

                document.getElementById(assignedId + "-chips").innerText = chips.toString()

                updatePage(document.getElementById("game"), assignedRoom)

                poker.emit('next-player', assignedRoom, startin_player, firstThree, raise)

            }
        }

        if (e.target.id == 'fold') {
            document.getElementById(assignedId + "-status").innerText = "Folded"
            document.getElementById(idPlaying).style.borderColor = "red"

            updatePage(document.getElementById("game"), assignedRoom)

            poker.emit('player-folded', assignedRoom, assignedId, startin_player, firstThree, raise)
        }

        if (e.target.id == 'raise') {

            document.getElementById(assignedId + "-status").innerHTML = "Raised by " + document.getElementById("demo").innerText
            document.getElementById(idPlaying).style.borderColor = "lightgreen"

            var chips = parseInt(document.getElementById(assignedId + "-chips").innerText)

            raise = parseInt(document.getElementById("demo").innerText)

            bet = raise

            chips -= bet

            document.getElementById(assignedId + "-chips").innerText = chips.toString()

            updatePage(document.getElementById("game"), assignedRoom)

            poker.emit('next-player', assignedRoom, startin_player, firstThree, raise)
        }
    }

})

document.querySelector('body').addEventListener('mousedown', function (e) {
    //only if its the turn of the player enable actions
    if (idPlaying == assignedId) {
        if (e.target.id == 'myRange') {
            e.target.oninput = function () {
                document.getElementById("demo").innerHTML = this.value
            }
        }
    }

})
//-------------------------------------------------------------------------------------------------------------------------------
//functions to render and update the client
function updatePage(gamePage, room) {
    var html = gamePage.outerHTML

    var updatedData = { html: html }

    poker.emit("save-game-data", updatedData, room)
}

function assignPlayerHtml(id) {
    document.getElementById("player").style.visibility = "visible"
    document.getElementById("player").id = id
    document.getElementById("player-status").id = id + "-status"
    document.getElementById("player-chips").id = id + "-chips"
}

function renderHand(card1, card2) {

    const userCard1 = document.getElementById("user-card-1")
    const userCard2 = document.getElementById("user-card-2")

    var userCard1Color
    var userCard2Color

    if (card1.suit === "♣" || card1.suit === "♠") {
        userCard1Color = "black"
    } else {
        userCard1Color = "red"
    }

    if (card2.suit === "♣" || card2.suit === "♠") {
        userCard2Color = "black"
    } else {
        userCard2Color = "red"
    }

    userCard1.style.backgroundImage = "none"
    userCard1.innerText = card1.suit
    userCard1.classList.add(userCard1Color)
    userCard1.dataset.value = `${card1.value} ${card1.suit}`

    userCard2.style.backgroundImage = "none"
    userCard2.innerText = card2.suit
    userCard2.classList.add(userCard2Color)
    userCard2.dataset.value = `${card2.value} ${card2.suit}`
}

function clearRound(players, card) {
    players.forEach(element => {
        document.getElementById(element + "-status").innerText = "Status"
        document.getElementById(element).style.borderColor = "gray"
    });

    var cardColor

    if (card.suit === "♣" || card.suit === "♠") {
        cardColor = "black"
    } else {
        cardColor = "red"
    }

    for (let i = 4; i <= 5; i++) {
        if (document.getElementById("table-card-" + i).innerText == "") {
            document.getElementById("table-card-" + i).style.backgroundImage = "none"
            document.getElementById("table-card-" + i).innerText = card.suit
            document.getElementById("table-card-" + i).classList.add(cardColor)
            document.getElementById("table-card-" + i).dataset.value = `${card.value} ${card.suit}`
            document.getElementById("table-card-" + i).style.bottom = "2rem"
            break
        }
    }

    if (document.getElementById("table-card-5").innerText != "") {
        document.getElementById("table-card-1").style.bottom = ""
        document.getElementById("table-card-2").style.bottom = ""
        document.getElementById("table-card-3").style.bottom = ""
        document.getElementById("table-card-4").style.bottom = ""
        document.getElementById("table-card-5").style.bottom = ""


    }
}

function render_firstThree_Cards(card) {

    var cardColor

    if (card.suit === "♣" || card.suit === "♠") {
        cardColor = "black"
    } else {
        cardColor = "red"
    }

    for (let i = 1; i <= 3; i++) {
        if (document.getElementById("table-card-" + i).innerText == "") {
            document.getElementById("table-card-" + i).style.backgroundImage = "none"
            document.getElementById("table-card-" + i).innerText = card.suit
            document.getElementById("table-card-" + i).classList.add(cardColor)
            document.getElementById("table-card-" + i).dataset.value = `${card.value} ${card.suit}`
            document.getElementById("table-card-" + i).style.bottom = "2rem"
            break
        }
    }
}