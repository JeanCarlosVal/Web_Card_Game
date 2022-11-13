const Card = require('./Card.js');

module.exports = class Deck {
    constructor(type) {
        this.cards = [];
        this.type = type;
        if (type === 'standard52') {
            this.numCards = 52;
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
    getBottom(index) {
        return this.cards[index];
    }
    getTop(index) {
        return this.cards[this.cards.length - index];
    }
    numCards() {
        return this.cards.length();
    }
    shuffle() {
        for (var i = 0; i < this.cards.length; i++) {
            var randi = Math.floor(Math.random() * (this.numCards));
            var rand = this.cards[randi];
            var ati = this.cards[i];
            // console.log("swapping " + ati +  " and " + rand, i, randi);
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
    toString() {
        var str = "";
        for (var i = 0; i < this.numCards; i++) {
           str += this.cards[i].toString() + '\n';
        }
        return str;
    }
}