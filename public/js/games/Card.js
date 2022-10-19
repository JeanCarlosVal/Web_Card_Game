<<<<<<< HEAD
import {toNameRank, toNameSuite } from '/js/games/CardUtils.js';
=======
import * as cu from '/js/games/CardUtils.js';
>>>>>>> 7444d281e6f95a04f058ebc8b784b3dc58c6d37c
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
<<<<<<< HEAD
            this.rank = toNameRank(rank);
=======
            this.rank = cu.toNameRank(rank);
>>>>>>> 7444d281e6f95a04f058ebc8b784b3dc58c6d37c
            this.numericRank = rank;
        }
        else if (typeof rank == 'string') {
            this.rank = rank;
<<<<<<< HEAD
            this.numericRank = toNumericRank(rank);
=======
            this.numericRank = cu.toNumericRank(rank);
>>>>>>> 7444d281e6f95a04f058ebc8b784b3dc58c6d37c
        }
        else {
            throw new Error("Invalid Rank Type: " + typeof rank);
        }

        // 1-4 or 'C','D','H','S'
        if (typeof suite == 'number') {
<<<<<<< HEAD
            this.suite = toNameSuite(suite);
=======
            this.suite = cu.toNameSuite(suite);
>>>>>>> 7444d281e6f95a04f058ebc8b784b3dc58c6d37c
            this.numericSuite = suite;
        }
        else if (typeof suite == 'string') {
            this.suite = suite;
<<<<<<< HEAD
            this.numericSuite = toNumericSuite();
=======
            this.numericSuite = cu.toNumericSuite();
>>>>>>> 7444d281e6f95a04f058ebc8b784b3dc58c6d37c
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
<<<<<<< HEAD
        return (this.numericRank +  (this.numericSuite-1) * 13) - (c.numericRank + (c.numericSuite-1) * 13);
=======
        return (this.rank_intToStr(this.rank) + (this.suite_intToStr(this.suite)-1) * 13) - (this.rank_intToStr(c.rank) + (this.suite_intToStr(suite)-1) * 13);
>>>>>>> 7444d281e6f95a04f058ebc8b784b3dc58c6d37c
    }
}

export {Card};

/*module.exports = {
    Card
};*/