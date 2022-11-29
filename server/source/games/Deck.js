const Card = require('./Card.js');

module.exports = class Deck {
    constructor(type) {
        this.cards = [];
        this.type = type;
        if (type === 'hand') {
            this.type = 'hand';
            this.total = 0;
        }
        else if (type === 'standard52') {
            this.type = 'standard52';
            this.total = 52;
            for (var suite = 1; suite <= 4; suite++) {
                for (var rank = 1; rank <= 13; rank++) {
                    this.cards.push(new Card(rank, suite));
                }
            }
        }
        else {
            throw new Error("Not a valid deck type.");
        }
    }
    draw() {
        return this.cards.pop();
    }
    drawBottom() {
        return this.cards.shift();
    }
    put(c) {
        this.cards.push(c);
    }
    putBottom(c) {
        this.cards.unshift(c);
    }
    // returns a refernce to the card at index. 0 is bottom, n is top.
    getTop(index) {
        return this.cards[this.cards.length - 1 - index];
    }
    getBottom(index) {
        return this.cards[index];
    }
    shuffle() {
        for (var i = 0; i < this.cards.length; i++) {
            var randi = Math.floor(Math.random() * (this.cards.length));
            var rand = this.cards[randi];
            var ati = this.cards[i];
            this.cards[i] = rand;
            this.cards[randi] = ati;
        }
    }
    // sorts by suite then rank
    sort() {
        this.cards.sort((a, b)=> {
            return a.compareTo(b);
        });
    }
    size() {
        return this.cards.length;
    }
    isEmpty() {
        if (this.cards.length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    toString() {
        var str = "";
        for (var i = 0; i < this.cards.size; i++) {
           str += this.cards[i].toString() + '\n';
        }
        return str;
    }
}