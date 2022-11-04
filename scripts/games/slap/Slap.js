const Deck = require('../Deck.js');
const Player = require('../Player.js');

module.exports = class Slap {
    constructor() {
        // waiting for fill

        this.players = [];
        this.currentPlayer = null;
        this.currentIndex = null;
        this.deck = new Deck('standard52');
        this.winner = null;
        this.maxPlayers = 8;
    }
    start() {
        this.currentPlayer = this.players[Math.ciel(Math.random()*4)];
    }
    finish() {
        return this.winner;
    }
    play(player, action) {
        if (action === 'put-card') {
            var card = this.currentPlayer.hand.draw();
            this.deck.place(card);
            this.advance();
        }
        if (action === 'slap') {
            // if valid combo, get the deck
            if (checkCombos()) {
                while (this.deck.numCards() > 0) {
                    player.hand.putBottom(deck.draw());
                }
            }
            // if not, put one card in the deck
            else {
                this.deck.put(player.hand.drawBottom());
            }
        }
    }
    // advances current player
    advance() {
        this.currentIndex++;
        if (this.currentIndex > 3) {
            this.currentIndex = 0;
        }
        this.currentPlayer = players[i];
    }
    addPlayer(playerid) {
        this.players.push(new Player(playerid));
        if (this.players.length == 4) {
            this.start();
        }
    }
    removePlayer() {

    }
    checkCombos() {
        check10();
        checkDouble();
        checkSandwich();
    }
    check10() {
        if (this.deck.numCards() < 2) {
            return false;
        }
        if (this.deck.getTop(0).numericRank + this.deck.getTop(1).numericRank == 10) {
            return true;
        }
    }
    checkDouble() {
        if (this.deck.numCards() < 2) {
            return false;
        }
        if (this.deck.getTop(0) == this.deck.getTop(1)) {
            return true;
        }
    }
    checkSandwich() {
        if (this.deck.numCards() < 3) {
            return false;
        }
        if (this.deck.getTop(0) == this.deck.getTop(2)) {
            return true;
        }
    }
    // returns the current state of the game which is all information about the game and players
    state() {
        return {
            player1: {
            }
        };
    }
}