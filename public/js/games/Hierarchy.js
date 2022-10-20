<<<<<<< HEAD
import * as cu from '/js/games/CardUtils.js';
// const cu = require('/js/games/CardUtils.js');
=======
// import * as cu from '/js/games/CardUtils.js';
const cu = require('/js/games/CardUtils.js');
>>>>>>> 7444d281e6f95a04f058ebc8b784b3dc58c6d37c

const aceLow = {
    "A":1,
    "2":2,
    "3":3,
    "4":4,
    "5":5,
    "6":6,
    "7":7,
    "8":8,
    "9":9,
    "10":10,
    "J":11,
    "Q":12,
    "K":13
};

const aceHigh = {
    "2":2,
    "3":3,
    "4":4,
    "5":5,
    "6":6,
    "7":7,
    "8":8,
    "9":9,
    "10":10,
    "J":11,
    "Q":12,
    "K":13,
    "A":14, 
};

const suiteconversions = {
    "C":1,
    "D":2,
    "H":3,
    "S":4
};

const hierarchies = {
    'aceLow':aceLow,
    'aceHigh':aceHigh
};

// A hierarchy is an ordering of the value of cards for a given game or situation. 
// Hierarchies allow easy comparison of card values (card values vary game to game).sta
// A game can have many hierarchies.
// To compare card ranks, the Card class has built-in functionality.
class Hierarchy {
    constructor(s) {
        if (hierarchies[s] === undefined) {
            throw new Error("Constructor: hierarchy not found.");
        }
        this.hierarchy = hierarchies[s];
    }
    // converts rank to numeric value based for given hierarchy
    rankValue(card) {
        if (typeof card.rank !== 'string') {
            throw new Error("Invalid Rank Type:" + typeof card.rank);
        }
        if (cu.isRank(card.rank)) {
            return this.hierarchy[card.rank];
        }
        else {
            throw new Error("Invalid Rank Name:" + card.rank + ". Must be " + this.hierarchy.keys());
        }
    }
    // converts suite to it's numeric value (alphabetical)
    suiteValue(card) {
        if (typeof card.suite !== 'string') {
            throw new Error("Invalid Suite Type:" + typeof card.suite + ". Must be 'string'");
        }
        if (cu.isSuite(card.suite)) {
            return suiteconversions[suite];
        }
        else {
            throw new Error("Invalid Suite Name:" + card.suite + ". Must be club, diamond, heart, or spade.");
        }  
    }
    // compares values:
    // > 1 means card1 has greater value
    // < 1 means card2 has greater value
    // 0 means they are equal value
    compare(card1, card2) {
        return this.rankValue(card1) - this.rankValue(card2);
    }
    help() {
        console.log("This class provides a hierarchy which is a way of ordering cards by value for a given game/situations.");
    }
}

export {Hierarchy};

<<<<<<< HEAD
// module.exports = {
//     Hierarchy
// };
=======
module.exports = {
    Hierarchy
};
>>>>>>> 7444d281e6f95a04f058ebc8b784b3dc58c6d37c
