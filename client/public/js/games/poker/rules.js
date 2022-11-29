import Deck from '/js/games/poker/Deck.js'

const cards = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14,
}

function startRound() {
    const deck = new Deck()
    deck.shuffle()
    return deck
}

function analyzeHand(hand) {

    let playerHand = {
        "Royal_Flush": Royal_Flush(hand),
        "Straight_Flush": Straight_Flush(hand),
        "Four_of_a_Kind": Four_of_a_Kind(hand),
        "Full_House": full_house(hand),
        "Flush": flush(hand),
        "Straight": Straight(hand),
        "Three_of_a_Kind": Three_of_a_Kind(hand),
        "Two_Pair": Two_Pair(hand),
        "One_Pair": One_Pair(hand),
        "High_Card": High_Card(hand)
    }

    return playerHand

}

function One_Pair(hand) {
    var pairFound = false
    var pair = 0
    var currentCards = {
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "J": 0,
        "Q": 0,
        "K": 0,
        "A": 0,
    }

    hand.forEach(card => {
        currentCards[card.value] += 1
    });

    var values = Object.keys(currentCards)

    values.forEach(value => {
        if (currentCards[value] == 2) {
            pairFound = true
            hand.forEach(card => {
                if(card.value == value){
                    pair = cards[value]
                }
            });
        }
    });

    if(pairFound){
        return pair
    } else {
        return 0
    }

}

function Two_Pair(hand) {
    var twoPair = {"one": 0, "two": 0}
    var count = 0
    var currentCards = {
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "J": 0,
        "Q": 0,
        "K": 0,
        "A": 0,
    }

    hand.forEach(card => {
        currentCards[card.value] += 1
    });

    var values = Object.keys(currentCards)

    values.forEach(value => {
        if (currentCards[value] == 2) {
            count += 1
            hand.forEach(card => {
                if(card.value == value){
                    if(count == 1){
                        twoPair.one = cards[value]
                    }else if(count == 2){
                        twoPair.two = cards[value]
                    }
                }
            });
        }
    });

    if(count >= 2){
        return twoPair
    }else{
        return 0
    }
}

function High_Card(hand) {
    var card = cards[hand[0].value]
    for (let i = 1; i < hand.length; i++) {
        if (cards[hand[i].value] > card) {
            card = cards[hand[i].value]
        }
    }

    return card
}

function Three_of_a_Kind(hand) {
    var three_found = 0
    var currentCards = {
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "J": 0,
        "Q": 0,
        "K": 0,
        "A": 0,
    }

    hand.forEach(card => {
        currentCards[card.value] += 1
    });

    var values = Object.keys(currentCards)

    values.forEach(value => {
        if (currentCards[value] == 3) {
            three_found = cards[value]
        }
    });
    return three_found
}

function Straight(hand) {
    var count = 0
    var Straightcardsvalues = []
    var straightcards = []

    var currentCards = {
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "J": 0,
        "Q": 0,
        "K": 0,
        "A": 0,
    }

    hand.forEach(card => {
        currentCards[card.value] = 1
    });

    const values = Object.keys(currentCards)
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (currentCards[value] == 1) {
            count += 1
            Straightcardsvalues.push(cards[value])
            if (count == 5) {
                break
            }
        } else {
            count = 0
            Straightcardsvalues = []
        }
    }

    hand.forEach(card => {
        if (Straightcardsvalues.includes(cards[card.value])) {
            straightcards.push(card)
        }
    });



    if (count < 5) {
        return 0
    } else {
        return straightcards
    }
}

function flush(hand) {
    if(hand == 0){
        return 0
    }
    var clubs = 0
    var diamonds = 0
    var hearts = 0
    var spades = 0

    hand.forEach(card => {
        if (card.suit == "♠") {
            spades += 1
        } else if (card.suit == "♣") {
            clubs += 1
        } else if (card.suit == "♥") {
            hearts += 1
        } else if (card.suit == "♦") {
            diamonds += 1
        }
    });

    if (clubs == 5) {
        return "♣"
    } else if (diamonds == 5) {
        return "♦"
    } else if (hearts == 5) {
        return "♥"
    } else if (spades == 5) {
        return "♠"
    } else {
        return 0
    }

}

function full_house(hand) {
    var one = One_Pair(hand)
    var three = Three_of_a_Kind(hand)
    if (one != 0 && three != 0) {
        return { "One_Pair": one, "Three_of_a_Kind": three }
    } else {
        return 0
    }
}

function Four_of_a_Kind(hand) {
    var four_found = 0

    var currentCards = {
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "J": 0,
        "Q": 0,
        "K": 0,
        "A": 0,
    }

    hand.forEach(card => {
        currentCards[card.value] += 1
    });

    var values = Object.keys(currentCards)

    values.forEach(value => {
        if (currentCards[value] == 4) {
            four_found = cards[value]
        }
    });

    return four_found
}

function Straight_Flush(hand) {
    const cards = Straight(hand)
    const cards_flush = flush(cards)

    if (cards != 0 && cards_flush != 0) {
        return cards
    } else {
        return 0
    }

}

function Royal_Flush(hand) {
    var possible_royal = 0
    var royal = []
    var royal_value = {
        "A": 0,
        "K": 0,
        "Q": 0,
        "J": 0,
        "10": 0,
    }

    hand.forEach(card => {
        if(card.value in royal_value){
            royal_value[card.value] = 1
            royal.push(card)
        }
    });

    var values = Object.keys(royal_value)

    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if(royal_value[value] == 1){
            possible_royal += 1
        }
    }

    if(possible_royal == 5){
        var suit = flush(royal)
        if(suit != 0){
            return {"suit": suit, "hand": royal}
        } else {
            return 0
        }
    }else{
        return 0
    }
}


export {
    startRound,
    analyzeHand,
}