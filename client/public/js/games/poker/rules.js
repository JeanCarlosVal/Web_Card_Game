import Deck from '/js/games/poker/Deck.js'

function startRound() {
    const deck = new Deck()
    deck.shuffle()
    return deck
}

function giveCardsToPlayer(deck){
    const cardOne = deck.pop()
    const cardTwo = deck.pop()

    document.getElementById()
}

export{
    startRound
}