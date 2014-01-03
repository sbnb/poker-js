var POKER = {
    rankToString: ['', '', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J',
        'Q', 'K', 'A'],
    suitToString: ['h', 'd', 'c', 's'],
    rankToInt: {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14},
    suitToInt: {'h': 0, 'd': 1, 'c': 2, s: '3'}
};

(function (POKER, undefined) {
    'use strict';
    var privateBar = 'this is private';
    POKER.foo = 'bar';
    POKER.getBar = function() {
        return privateBar;
    };
})(POKER = POKER);

POKER.Card = function(rank, suit) {
    this.getRank = function() {return rank};
    this.getSuit = function() {return suit};
    this.toString = function() {
        return POKER.rankToString[rank] + '' + POKER.suitToString[suit];
    }
};

// create Card object from string like 'As', 'Th' or '2c'
POKER.cardFromString = function(cardVal) {
    console.log('cardFromString: ' + cardVal);
    return new POKER.Card(5, 3);
};

// create Hand object from array of Card objects
POKER.Hand = function(cards) {};

// create Hand object from string like 'As Ks Th 7c 4s'
POKER.handFromString = function() {};

// a deck of Card objects
POKER.Deck = function() {};

// compare an array of Hands and return the winner(s)
POKER.compare = function(hands) {};

exports.POKER = POKER;
