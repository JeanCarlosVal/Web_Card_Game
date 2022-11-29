import Deck from "/js/games/war/deckAvery.js";

const CARD_VALUE_MAP = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 10,
  Q: 10,
  K: 10,
  A: 11
}

var dealerSum = 0;
var playerSum = 0;

var dealerAceCount = 0;
var playerAceCount = 0; 

//var hidden;
//var card1;
//var card2;
var deck = new Deck();

var canHit = true;

let playerDeck, computerDeck, inRound, stop

window.onload = function() {
  startGame();
}

startGame()
function startGame() {
  deck.shuffle()

  const hidden = deck.pop();
  
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  console.log("here123");
  console.log(hidden);
  console.log("here1")
  console.log(dealerSum);

  const card1 = deck.pop()
  playerSum += getValue(card1);
  console.log(playerSum);
  console.log(card1);

  

  const card2 = deck.cards.pop()
  playerSum += getValue(card2);
  console.log(card2);
  console.log(playerSum);

  renderHand(card1, card2)

  
  while(dealerSum < 17) {
//card img here

    console.log("Why am i here")
    //let cardImg = document.createElement("img");    
    let card = deck.pop();

    dealerSum += getValue(card);

  }

  for (let i = 0; i < 2; i++) {

    let card = deck.pop();
    playerSum += getValue(card);
    playerAceCount += getValue(card);

  }

  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
   if (!canHit) {
    return;
   }

   let card = deck.pop();
   playerSum += getValue(card);
   playerAceCount += getValue(card);

   if (reduceAce(playerSum, playerAceCount) > 21)
   {
    canHit = false;
   }
}

function stay() {

  dealerSum = reduceAce(dealerSum, dealerAceCount);
  playerSum = reduceAce(playerSum, playerAceCount);

  canHit = false;


  let message = "";
  if (playerSum > 21) {
      message = "You Lose!";
  }
  else if (dealerSum > 21) {
      message = "You win!";
  }
  //both you and dealer <= 21
  else if (playerSum == dealerSum) {
      message = "Tie!";
  }
  else if (playerSum > dealerSum) {
      message = "You Win!";
  }
  else if (playerSum < dealerSum) {
      message = "You Lose!";
  }

  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;

  
}

function getValue(card) {
    return CARD_VALUE_MAP[card.value]
}

function checkAce(card) {
  if (CARD_VALUE_MAP[card.value] == 11)
  {
    return 1;
  }
  return 0;
}

function reduceAce(Sum, AceCount) {
  while (Sum > 21 && AceCount > 0) {
      Sum -= 10;
      AceCount -= 1;
  }
  return Sum;
}

function renderHand(card1, card2) {

  const userCard1 = document.getElementById("player-card-1")
  const userCard2 = document.getElementById("player-card-2")
  
  var userCard1Color
  var userCard2Color

  if (card1.suit === "♣" || card1.suit === "♠") {
      userCard1Color = "black"
  } else {
      userCard1Color = "red"
  }

  if (card2.suit === "♣" || card2.suit === "♠") {
      userCard2Color = "black"
  } else {
      userCard2Color = "red"
  }

  userCard1.style.backgroundImage = "none"
  userCard1.innerText = card1.suit
  userCard1.classList.add(userCard1Color)
  userCard1.dataset.value = `${card1.value} ${card1.suit}`

  userCard2.style.backgroundImage = "none"
  userCard2.innerText = card2.suit
  userCard2.classList.add(userCard2Color)
  userCard2.dataset.value = `${card2.value} ${card2.suit}`
}
