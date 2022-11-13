const Deck = require('../Deck.js');
const Player = require('../Player.js');

module.exports = class Slap {
    constructor() {
        // waiting for fill
        this.game = "slap";
        this.players = []; // array type: Player
        this.currentPlayer = null;
        this.currentIndex = null;
        this.deck = new Deck('standard52');
        this.winner = null;
        this.maxPlayers = 8;
        this.state = {};
    }
    start() {
        console.log("inside game: game started");
        this.currentPlayer = this.players[Math.floor(Math.random()*this.players.length)];
        // console.log(this.currentPlayer instanceof Player);
        // console.log("current player: " + this.currentPlayer.socketid);
        // distribute cards
        this.deck.shuffle();
        var i = 0;
        while (!this.deck.isEmpty()) {
            console.log("start" + this.deck.size());
            this.players[i].put(this.deck.draw());
            i++;
            if (i == this.players.length) {
                i = 0;
            }
        }
        // initialize game state
        var p = "player";
        for (var i = 0; i < this.players.length; i++) {
            this.state[p+i+1] = {
                socketid:players[i].socketid,
                username:players[i].username,
                sessionid:playes[i].sessionid,
                numCards:0,
            }
        }
        this.state.currentPlayerSID = this.currentPlayer.socketid;

    }
    finish() {
        return this.winner;
    }
    play(action, playerid) {
        var player = this.players.find((elem) => {
            // console.log(elem);
            return elem.socketid == playerid;
        });
        // console.log(this.currentPlayer);
        // console.log(player);
        if (action === 'put' && this.currentPlayer.socketid == player.socketid) {
            console.log('action = put');
            var card = this.currentPlayer.hand.draw();
            this.deck.put(card);
            // console.log("old current player " + this.currentPlayer.socketid);
            this.advance();
            // console.log("new current player " + this.currentPlayer);
            // console.log("new current player "  + this.currentPlayer.socketid);

        }
        else if (action === 'slap') {
            console.log('action = slap');
            // if valid combo, get the deck
            if (this.checkCombos()) {
                while (this.deck.cards.length > 0) {
                    console.log("slap");
                    player.hand.putBottom(this.deck.draw());
                }
                console.log(player.socketid + " got the deck: " + this.deck.size())
                console.log(this.deck);
                return "good";
            }
            // if not, put one card in the deck
            else {
                this.deck.put(player.hand.drawBottom());
                return "bad";
            }
        }
    }
    // advances current player
    advance() {
        console.log("advancing");
        this.currentIndex++;
        if (this.currentIndex == this.players.length) {
            this.currentIndex = 0;
        }
        this.currentPlayer = this.players[this.currentIndex];
    }
    addPlayer(socketid) {
        this.players.push(new Player(socketid));
        if (this.players.length >= this.maxPlayers / 2) {
            this.start();
        }
    }
    removePlayer(socketid) {
        for (var i = 0; i < this.players.length; i++) {
            if (players.socketid = socketid) {
                this.players.splice(i, 1);
                break;
            }
        }
    }
    checkCombos() {
        return this.check10() || this.checkDouble() || this.checkSandwich();
    }
    check10() {
        console.log(this.deck.size());
        if (this.deck.size() < 2) {
            return false;
        }
        else if (this.deck.getTop(0).numericRank + this.deck.getTop(1).numericRank == 10) {
            console.log("CHECK10");
            console.log(this.deck.getTop(0));
            console.log(this.deck.getTop(1));
            return true;
        }
        else {
            return false;
        }
    }
    checkDouble() {
        if (this.deck.size() < 2) {
            return false;
        }
        else if (this.deck.getTop(0).compareTo(this.deck.getTop(1)) == 0) {
            console.log("CHECKDOUBLE");
            console.log(this.deck.getTop(0));
            console.log(this.deck.getTop(1));
            return true;
        }
        else  {
            return false;
        }
    }
    checkSandwich() {
        if (this.deck.size() < 3) {
            return false;
        }
        else if (this.deck.getTop(0).compareTo(this.deck.getTop(2)) == 0) {
            console.log("CHECKSAND");
            console.log(this.deck.getTop(0));
            console.log(this.deck.getTop(2));
            return true;
        }
        else {
            return false;
        }
    }
    // returns the current state of the game which is all information about the game and players
    state() {
    }
}