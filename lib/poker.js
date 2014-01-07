var POKER = {
    rankToString: ['', '', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J',
        'Q', 'K', 'A'],
    suitToString: ['h', 'd', 'c', 's'],
    rankToInt: {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14},
    suitToInt: {'h': 0, 'd': 1, 'c': 2, 's': 3}
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
    return new POKER.Card(
        POKER.rankToInt[cardVal[0]],
        POKER.suitToInt[cardVal[1]]
    );
};

// create Hand object from array of Card objects
POKER.Hand = function(cards) {
    this.numSameSuits = function() {
        var counters = [0, 0, 0, 0];
        for (var idx = 0; idx < cards.length; idx += 1) {
            counters[cards[idx].getSuit()] += 1;
        };
        return Math.max.apply(null, counters);
    };

    // number of longest consecutive straight run
    this.numConnected = function() {
        var oRanks = this.getOrderedRanks(),
            run = max = 1,
            thisCardRank, prevCardRank;

        for (var idx = 1; idx < oRanks.length; idx += 1) {
            thisCardRank = oRanks[idx];
            prevCardRank = oRanks[idx - 1];
            if (thisCardRank !== prevCardRank + 1) {
                run = 1;
            }
            else {
                run = run + 1;
                max = run > max ? run : max;
            }
        }
        if (isLowStraight(oRanks)) {
            return 5;
        }
        return max;
    };

    this.getOrderedRanks = function(desc) {
        var ranks = [];
        for (var idx = 0; idx < cards.length; idx += 1) {
            ranks.push(parseInt(cards[idx].getRank(), 10));
        };
        return sortIntArray(ranks, desc);
        // return ranks.sort();
    };

    // special case where A plays low for A to 5 straight
    function isLowStraight(oRanks) {
        var lowFourCards = oRanks.slice(0, 4);
        // if 2,3,4,5 and Ace in hand
        if (equivIntArrays(lowFourCards, [2,3,4,5]) && oRanks.indexOf(14) > -1) {
            return true;
        }
        return false;
    }

    // true if two int arrays identical
    function equivIntArrays(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        for (var idx = 0; idx < a.length; idx += 1) {
            if (a[idx] !== b[idx]) {
                return false;
            }
        }
        return true;
    }

    // temp sort function, replace with array.sort
    function sortIntArray(array, desc) {
        var sorted = [];
        for (var idx = 0; idx < array.length; idx += 1) {
            var indexOfMax = getIndexOfMax(array);
            sorted.push(array[indexOfMax]);
            array[indexOfMax] = -1;
        }
        if (!desc) {
            sorted.reverse();
        }
        return sorted;
    }

    function getIndexOfMax(array) {
        var max = 0,
            maxIndex = -1;
        for (var idx = 0; idx < array.length; idx += 1) {
            if (array[idx] > max) {
                max = array[idx];
                maxIndex = idx;
            }
        };
        return maxIndex;
    }

    this.numOfAKind = function() {
        return [0];
    };

    this.toString = function() {
        var str = '';
        for (var idx = 0; idx < cards.length; idx += 1) {
            str += cards[idx].toString() + ' ';
        };
        return str.slice(0, str.length - 1);
    }
};

// create Hand object from string like 'As Ks Th 7c 4s'
POKER.handFromString = function(handString) {
    var cardStrings = handString.split(' '),
        cards = [];
    for (var idx = 0; idx < cardStrings.length; idx += 1) {
        cards.push(POKER.cardFromString(cardStrings[idx]));
    };
    return new POKER.Hand(cards);
};

// a deck of Card objects
POKER.Deck = function() {};

// compare an array of Hands and return the winner(s)
POKER.compare = function(hands) {};

// if in Node.js environment export the POKER namespace
if (typeof exports !== 'undefined') {
    exports.POKER = POKER;
}
