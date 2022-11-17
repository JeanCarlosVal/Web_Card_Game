module.exports = class Crazy8 {
    constructor() {
        this.game = "crazy8";
        this.players = []; // array type: Player
        this.currentPlayer = null;
        this.currentIndex = null;
        this.deck = new Deck('standard52');
        this.winner = null;
        this.maxPlayers = 8;
        this.state = {};
    }
}