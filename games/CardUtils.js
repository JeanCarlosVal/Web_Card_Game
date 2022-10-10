rankconversions = {
    "ace":1,
    "two":2,
    "three":3,
    "four":4,
    "five":5,
    "six":6,
    "seven":7,
    "eight":8,
    "nine":9,
    "ten":10,
    "jack":11,
    "queen":12,
    "king":13
};

const suiteconversions = {
    "club":1,
    "diamond":2,
    "heart":3,
    "spade":4
};

function rank_strToInt(rank) {
    if (typeof rank !== 'string') {
        throw new Error("Invalid Rank Type:" + typeof rank);
    }
    if (isRank(rank)) {
        return rankconversions[rank];
    }
    else {
        throw new Error("Invalid Rank Name:" + rank + ". Must be 'ace','two','three','four','five','six','seven','eight','nine','ten','jack,'queen', or 'king'.");
    }
}
function rank_intToStr(rank) {
    if (typeof rank !== 'number') {
        throw new Error("Invalid Rank Type:" + typeof rank + ". Must be 'number'.");
    }
    if (rank > 13 || rank < 1) {
        throw new Error("Integer out of Range:" + rank +  + ". Must be between 1 and 13.");
    }
    return Object.keys(rankconversions).find(key => rankconversions[key] === rank);
}

function suite_strToInt(suite) {
    if (typeof suite !== 'string') {
        throw new Error("Invalid Suite Type:" + typeof suite + ". Must be 'string'");
    }
    if (isSuite(suite)) {
        return suiteconversions[suite];
    }
    else {
        throw new Error("Invalid Suite Name:" + suite + ". Must be club, diamond, heart, or spade.");
    }  
}
function suite_intToStr(suite) {
    if (typeof suite !== 'number') {
        throw new Error("Invalid Suite Type:" + typeof suite + ". Must be 'number'.");
    }
    if (suite > 4 || suite < 1) {
        throw new Error("Integer out of Range:" + suite + ". Must be between 1 and 4.");
    }
    return Object.keys(suiteconversions).find(key => suiteconversions[key] === suite);
}

function isRank(rank) {
    if (rankconversions[rank] === undefined) {
        return false;
    }
    return true;
}
function isSuite(suite) {
    if (suiteconversions[suite] === undefined) {
        return false;
    }
    return true;
}

module.exports = {
    rank_intToStr,
    rank_strToInt,
    suite_intToStr,
    suite_strToInt,
    isRank,
    isSuite
};

