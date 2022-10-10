const cu = require('./CardUtils.js');

class Card {
    constructor(rank, suite) {
        if (typeof rank == 'number') {
            this.rank = rank;
            this.rankStr = cu.rank_intToStr(rank);
        }
        else if (typeof rank == 'string') {
            this.rank = cu.rank_strToInt(rank);
            this.rank = rank;
        }
        else {
            throw new Error("Invalid Rank Type: " + typeof rank);
        }

        if (typeof suite == 'number') {
            this.suite = suite;
            this.suiteStr = cu.suite_intToStr(suite);
        }
        else if (typeof suite == 'string') {
            this.suite = cu.suite_strToInt(suite);
            this.suite = suite;
        }
        else {
            throw new Error("Invalid Suite Type: " + typeof suite);
        }
    }

    toString() {
        return this.rankStr + " of " + this.suiteStr + "s";
    }
}

module.exports = {
    Card
};