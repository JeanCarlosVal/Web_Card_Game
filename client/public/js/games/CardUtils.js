const ranking = {
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

const suiting = {
    "C":1,
    "D":2,
    "H":3,
    "S":4
};

function toNumericRank(nameRank) {
    if (typeof nameRank !== 'string') {
        throw new Error("Invalid Rank Type:" + typeof nameRank);
    }
    if (isRank(nameRank)) {
        return ranking[nameRank];
    }
    else {
        throw new Error("Invalid Rank Name:" + nameRank + ". Must be 'ace','two','three','four','five','six','seven','eight','nine','ten','jack,'queen', or 'king'.");
    }
}
function toNameRank(numericRank) {
    if (typeof numericRank !== 'number') {
        throw new Error("Invalid Rank Type:" + typeof numericRank + ". Must be 'number'.");
    }
    if (numericRank > 13 || numericRank < 1) {
        throw new Error("Integer out of Range:" + numericRank +  + ". Must be between 1 and 13.");
    }
    return Object.keys(ranking).find(key => ranking[key] === numericRank);
}
function toNumericSuite(nameSuite) {
    if (typeof nameSuite !== 'string') {
        throw new Error("Invalid Suite Type:" + typeof nameSuite + ". Must be 'string'");
    }
    if (isSuite(nameSuite)) {
        return suiting[nameSuite];
    }
    else {
        throw new Error("Invalid Suite Name:" + nameSuite + ". Must be club, diamond, heart, or spade.");
    }  
}
function toNameSuite(numericSuite) {
    if (typeof numericSuite !== 'number') {
        throw new Error("Invalid Suite Type:" + typeof numericSuite + ". Must be 'number'.");
    }
    if (numericSuite > 4 || numericSuite < 1) {
        throw new Error("Integer out of Range:" + numericSuite + ". Must be between 1 and 4.");
    }
    return Object.keys(suiting).find(key => suiting[key] === numericSuite);
}

function isRank(rank) {
    if (ranking[rank] === undefined) {
        return false;
    }
    return true;
}
function isSuite(suite) {
    if (suiting[suite] === undefined) {
        return false;
    }
    return true;
}

function help() {
    console.log("This module provides common card functionality like converting numeric rank/suite to named rank/suite and vice versa, valid ranks and suites");
}

export {
    toNameRank,
    toNumericRank,
    toNameSuite,
    toNumericSuite,
    isRank,
    isSuite,
    help,
};

// module.exports = {
//     toNameRank,
//     toNumericRank,
//     toNameSuite,
//     toNumericSuite,
//     isRank,
//     isSuite,
//     help,
// };

