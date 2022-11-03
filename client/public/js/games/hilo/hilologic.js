import {Deck}from '/js/games/Deck.js';
import {Hierarchy} from '/js/games/Hierarchy.js';

console.log("HiLoLogic is here!");

const deck = new Deck('standard52');
var base = undefined; 
deck.shuffle();

var numcorrect = 0;
var numwrong = 0;

var basedisplay = document.getElementById("basedisplay");
var challengedisplay = document.getElementById("challengedisplay");
var numWrongDisp = document.getElementById("numwrong");
var numCorrectDisp = document.getElementById("numcorrect");

getNewCard();

// prepare for next guess
function getNewCard() {
    base = deck.draw();
    if (base == undefined) {
        gameOver();
        return;
    }
    document.getElementById("basedisplay").innerHTML = base.toString();
    document.getElementById("challengedisplay").style.visibility = "hidden";
    document.getElementById("higher").style.visibility = "visible";
    document.getElementById("lower").style.visibility = "visible";
    document.getElementById("nextbutton").style.visibility = "hidden";
    document.getElementById("result").style.visibility = "hidden";
}

document.getElementById("nextbutton").addEventListener('click', getNewCard);

// guess has been made, show right stuff.
function updateNums() {
    numWrongDisp.innerHTML = numwrong;
    numCorrectDisp.innerHTML = numcorrect;
    document.getElementById("higher").style.visibility = "hidden";
    document.getElementById("lower").style.visibility = "hidden";
    document.getElementById("nextbutton").style.visibility = "visible";
    document.getElementById("result").style.visibility = "visible";
    document.getElementById("challengedisplay").style.visibility = "visible";


}

document.getElementById("higher").addEventListener('click', () => {
    const h = new Hierarchy("aceLow");
    const result = document.getElementById("result");
    const challenge = deck.draw();
    document.getElementById("challengedisplay").innerHTML = challenge.toString();
    if (h.compare(challenge, base) > 0) {
        result.innerHTML = "Correct!";
        numcorrect++;
    }
    else {
        result.innerHTML = "Wrong!";
        numwrong++;
    }
    updateNums();
});

document.getElementById("lower").addEventListener('click', () => {
    const h = new Hierarchy("aceLow");
    const result = document.getElementById("result");
    const challenge = deck.draw();
    document.getElementById("challengedisplay").innerHTML = challenge.toString();
    if (h.compare(challenge, base) > 0) {
        result.innerHTML = "Wrong!";
        numwrong++;
    }
    else {
        result.innerHTML = "Correct!";
        numcorrect++;
    }
    updateNums();
});

//set win to 0 or 1 depending on if game result is a loss(0) or win(1);
function gameOver() {
    const xhr = new XMLHttpRequest();
    xhr.open('post','/game_results');
    xhr.send({'wins': 1, 'game': 'hi_lo', 'sessionID': sessionID});
    document.body.innerHTML = "<p>The game is over because the deck is empty. You got " + numcorrect + " right and " + numwrong + " wrong. Refresh to play again.";
}
