import Deck from '/js/games/poker/Deck.js'

function startRound() {
    const deck = new Deck()
    deck.shuffle()
    return deck
}

export{
    startRound
}