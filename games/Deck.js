const { Card } = require("./Card");

class Deck {
    constructor(standard52) {
        this.cards = [];
        this.numCards = 52;
        if (standard52) {
            for (var suite = 1; suite <= 4; suite++) {
                for (var rank = 1; rank <= 13; rank++) {
                    this.cards.push(new Card(rank, suite));
                }
            }
        }
    }
    draw() {
        return this.cards.pop();
    }
    bottomDraw() {
        this.cards.shift();
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
            return (a.rank + ((a.suite-1) * 13)) - (b.rank + ((b.suite-1) * 13));
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
