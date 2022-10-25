import {toNameRank, toNameSuite } from '/js/games/CardUtils.js';
// const cu = require('./CardUtils.js');

class Card {
    // Construction: the number passed is not the value in hierarchy, but the pure rank
    // 1='A'
    // 2='2'
    //...
    // 13='K'
    constructor(rank, suite) {
        // 1-13 or 'A','2','3','4','5','6','7','8','9','10','J','Q','K'
        if (typeof rank == 'number') {
            this.rank = toNameRank(rank);
            this.numericRank = rank;
        }
        else if (typeof rank == 'string') {
            this.rank = rank;
            this.numericRank = toNumericRank(rank);
        }
        else {
            throw new Error("Invalid Rank Type: " + typeof rank);
        }

        // 1-4 or 'C','D','H','S'
        if (typeof suite == 'number') {
            this.suite = toNameSuite(suite);
            this.numericSuite = suite;
        }
        else if (typeof suite == 'string') {
            this.suite = suite;
            this.numericSuite = toNumericSuite();
        }
        else {
            throw new Error("Invalid Suite Type: " + typeof suite);
        }
    }

    toString() {
        return this.rank + " of " + this.suite + "s";
    }

    // compares rank, not value
    compareTo(c) {
        return (this.numericRank +  (this.numericSuite-1) * 13) - (c.numericRank + (c.numericSuite-1) * 13);
    }
}

export {Card};

/*module.exports = {
    Card
};*/