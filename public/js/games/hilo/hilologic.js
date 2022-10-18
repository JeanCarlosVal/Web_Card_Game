import {Deck}from '/js/games/Deck.js';
import * as cu from '../CardUtils.js';

console.log("HiLoLogic is here!");

const deck = new Deck(true);
const base = undefined;
const h = cu.aceLow;
deck.shuffle();

var numcorrect = 0;
var numwrong = 0;

const result = document.getElementById("result");
const numWrongDisp = document.getElementById("numwrong");
const numCorrectDisp = document.getElementById("numcorrect");
var compareCard = undefined;

getNewCard();

function getNewCard() {
    compareCard = document.getElementById("carddisplay").innerHTML = deck.draw().toString();
}

function updateNums() {
    numCorrectDisp.innerHTML = numwrong;
    numCorrectDisp.innerHTML = numcorrect;
}

document.getElementById("higher").addEventListener('click', () => {
    if (c.compareTo(base) > 0) {
        result.innerHTML = "Correct!";
        numcorrect++;
    }
    else {
        result.innerHTML = "Wrong!";
        numwrong++;
    }
    updateNums();
    getNewCard();
});

document.getElementById("lower").addEventListener('click', () => {
    if (c.compareTo(base) > 0) {
        result.innerHTML = "Wrong!";
        numwrong++;
    }
    else {
        result.innerHTML = "Correct!";
        numcorrect++;
    }
    updateNums();
    getNewCard();
});


