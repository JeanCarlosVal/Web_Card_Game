const Deck = require("./Deck")

module.exports = class Player {
    constructor(socketid, options) {
        this.hand = new Deck('hand');
        this.socketid = socketid;
        if (options) {
            this.username = options.username;
            this.session = options.session;
        }
    }
    draw() {
        return this.hand.draw();
    }
    drawBottom() {
        return this.hand.draw();
    }
    put(card) {
        this.hand.put(card);
    }
    putBottom(card) {
        this.hand.putBottom(card);
    }
}