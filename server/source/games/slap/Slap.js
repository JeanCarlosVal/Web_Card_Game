const Deck = require('../Deck.js');
const Player = require('../Player.js');

module.exports = class Slap {
    constructor() {
        // waiting for fill
        this.game = "slap";
        this.players = []; // array type: Player
        this.currentPlayer = null;
        this.currentIndex = null;
        this.prevPlayer = null;
        this.deck = new Deck('standard52');
        this.winner = null;
        this.maxPlayers = 8;
        this.state = {};
        this.isPostLock;
        this.isGraceTime = false;
        /*
        grace time: the period after a valid slap
        1. no consequences for players slapping
        2. current player cannot put a card
        */
        this.lock = -1;
        /*
        -1: no lock
        0: lock over
        >0: current lock
        */
    }
    start() {
        console.log("inside game: game started");
        this.currentIndex = Math.floor(Math.random()*this.players.length);
        this.currentPlayer = this.players[this.currentIndex];
        // console.log(this.currentPlayer instanceof Player);
        console.log("starting player: " + this.currentPlayer.socketid);
        // distribute cards
        console.log(this.deck);
        this.deck.shuffle();
        console.log(this.deck);
        var i = 0;
        while (!this.deck.isEmpty()) {
            console.log("giving out cards");
            this.players[i].put(this.deck.draw());
            i++;
            if (i == this.players.length) {
                i = 0;
            }
        }
    }
    finish() {
        return this.winner;
    }
    put(playerid) {
        var player = this.players.find((elem) => {
            return elem.socketid == playerid;
        });
        if (this.currentPlayer.socketid != player.socketid) {
            console.log("mismatch on current player");
            return null;
        }
        if (this.isGraceTime) {
            return null;
        }
        console.log('action = put');
        console.log('HAND ' + this.currentPlayer.hand.size());
        var card = this.currentPlayer.hand.draw();
        console.log('card: ' + card.toString());
        this.deck.put(card);


        // break the lock
        if (this.lockValue(card)) {
            console.log('new lock');
            this.lock = this.lockValue(card);
            this.advance();
        }
        // lose the lock
        else if (this.lock == 1) {
            console.log("lock lost! prev gets the deck! " + this.prevPlayer.socketid);
            while (this.deck.cards.length > 0) {
                this.prevPlayer.hand.putBottom(this.deck.draw());
            }
            this.lock = 0; // no more lock
            this.currentPlayer = this.prevPlayer; // starter player is winner of lock
            this.currentIndex = this.players.indexOf(this.currentPlayer);
            this.prevPlayer = null; // no prev player
            this.isPostLock = true;
        }
        // lock in progress
        else if (this.lock > 0) {
            console.log('lock in progress');
            this.lock--;
        }
        // no lock
        else {
            console.log('no lock');
            this.advance();
        }

        console.log("inside Slap: card" + card);
        return card;
    }
    slap(playerid) {
        var player = this.players.find((elem) => {
            return elem.socketid == playerid;
        });
        console.log('action = slap');
        if (this.isGraceTime) {
            return "slow";
        }
        // if valid combo, get the deck
        if (this.checkCombos()) {
            this.isGraceTime = true;
            setTimeout( () => {
                console.log("GRACE TIME OVER!!");
                this.isGraceTime = false;
            }, 2000);
            while (this.deck.cards.length > 0) {
                console.log("giving deck to slapper");
                player.hand.putBottom(this.deck.draw());
            }
            console.log(player.socketid + " got the deck: " + this.deck.size())
            console.log(this.deck);
            this.lock = 0; // lock is broken on valid slap
            this.currentPlayer = player;
            return "good";
        }
        // if not, put one card in the deck
        else {
            console.log("bad slap");
            this.deck.put(player.hand.drawBottom());
            return "bad";
        }
    }
    play(action, playerid) {
        console.log("action");

        if (action == 'put') {
            this.put(playerid);
        }
        else if (action == 'slap') {
            this.slap(playerid);
        }
        else {
            console.log('unrecognized action: ' + action);
        }
    }
    // advances current player
    advance() {
        console.log("advancing");
        this.currentIndex++;
        if (this.currentIndex >= this.players.length) {
            this.currentIndex = 0;
        }
        this.prevPlayer = this.currentPlayer;
        this.currentPlayer = this.players[this.currentIndex];

        if (this.currentPlayer.hand.size() == 0) {
            this.advance();
        }
    }
    addPlayer(socketid) {
        this.players.push(new Player(socketid));
        if (this.players.length >= this.maxPlayers / 2) {
            this.start();
        }
    }
    removePlayer(socketid) {
        for (var i = 0; i < this.players.length; i++) {
            console.log("remove player");
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
        console.log("CHECKING 10");
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
        console.log("CHECKING double");
        if (this.deck.size() < 2) {
            return false;
        }
        else if (this.deck.getTop(0).rank == this.deck.getTop(1).rank) {
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
        console.log(this.deck.size());
        console.log("CHECKING sandwich");
        if (this.deck.size() < 3) {
            console.log("too small");
            return false;
        }
        else if (this.deck.getTop(0).rank == this.deck.getTop(2).rank) {
            console.log("CHECKSAND");
            console.log(this.deck.getTop(0));
            console.log(this.deck.getTop(2));
            return true;
        }
        else {
            console.log("sandwhich not found");
            return false;
        }
    }
    lockValue(card) {
        if (card.numericRank == 11) { // jack
            return 1;
        }
        else if (card.numericRank == 12) { // queen
            return 2;
        }
        else if (card.numericRank == 13) { // king
            return 3;
        }
        else if (card.numericRank == 1) { // ace
            return 4;
        }
        else {
            return 0;
        }
    }

    checkWinner() {
        this.players.forEach( elem => {
            if (elem.hand.size() == 52) {
                this.winner = elem;
                return;
            }
        });
    }
}