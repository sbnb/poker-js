var POKER = {
    rankToString: ['', '', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J',
        'Q', 'K', 'A'],
    rankToWord: ['', '', 'two', 'three', 'four', 'five', 'six', 'seven',
        'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'],
    suitToString: ['h', 'd', 'c', 's'],
    rankToInt: {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14},
    suitToInt: {'h': 0, 'd': 1, 'c': 2, 's': 3},
    HAND_TYPE: {'HIGH_CARD': 1, 'PAIR': 2, 'TWO_PAIR': 3, 'TRIPS': 4,
        'STRAIGHT': 5, 'FLUSH': 6, 'FULL_HOUSE': 7, 'QUADS': 8,
        'STRAIGHT_FLUSH': 9}
};

// an immutable Card object with a rank and a suit
POKER.Card = function(rank, suit) {
    this._rank = rank;
    this._suit = suit;
};

POKER.Card.prototype.getRank = function() {
    return this._rank;
};

POKER.Card.prototype.getSuit = function() {
    return this._suit;
};

POKER.Card.prototype.toString = function() {
    return POKER.rankToString[this._rank] + '' + POKER.suitToString[this._suit];
};

// create Card object from string like 'As', 'Th' or '2c'
POKER.cardFromString = function(cardVal) {
    return new POKER.Card(
        POKER.rankToInt[cardVal[0]],
        POKER.suitToInt[cardVal[1]]
    );
};

// a poker Hand object consists of a set of Cards, and poker related functions
POKER.Hand = function(cards) {
    this.cards = cards;
};

POKER.Hand.prototype.numSameSuits = function() {
    var counters = [0, 0, 0, 0];
    for (var idx = 0; idx < this.cards.length; idx += 1) {
        counters[this.cards[idx].getSuit()] += 1;
    };
    return Math.max.apply(null, counters);
};

// number of longest consecutive card rank run
POKER.Hand.prototype.numConnected = function() {
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
    if (this.isLowStraight(oRanks)) {
        return 5;
    }
    return max;
};

// special case where A plays low for A to 5 straight
POKER.Hand.prototype.isLowStraight = function(oRanks) {
    var lowFourCards = oRanks.slice(0, 4);
    // if 2,3,4,5 and Ace in hand
    if (this.equivIntArrays(lowFourCards, [2,3,4,5]) && oRanks.indexOf(14) > -1) {
        return true;
    }
    return false;
}

// true if two int arrays identical
POKER.Hand.prototype.equivIntArrays = function(a, b) {
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

// return ranks ordered lowest to highest: 2..14 (ace plays high)
POKER.Hand.prototype.getOrderedRanks = function(desc) {
    var ranks = [];
    for (var idx = 0; idx < this.cards.length; idx += 1) {
        ranks.push(parseInt(this.cards[idx].getRank(), 10));
    };
    return ranks.sort(this.numeric);
};

// return count of same ranked cards, e.g. [3,2] for fullhouse
POKER.Hand.prototype.numOfAKind = function() {
    var rankCount = this.getRankCount(),
        values = this.objToArray(rankCount),
        numKind = values.sort(this.numeric).reverse();
    return numKind;
};

// map each rank to number of times it occurs in hand
POKER.Hand.prototype.getRankCount = function() {
    var oRanks = this.getOrderedRanks(),
        rankCount = {};
    for (var idx = 0; idx < oRanks.length; idx += 1) {
        if (rankCount[oRanks[idx]]) {
            rankCount[oRanks[idx]] += 1;
        }
        else {
            rankCount[oRanks[idx]] = 1;
        }
    }
    return rankCount;
};

// return obj values as array
POKER.Hand.prototype.objToArray = function(obj) {
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            values.push(obj[key]);
        }
    }
    return values;
}

// 99887: getRankByOccurance(2) => [9,8]
POKER.Hand.prototype.getRankByOccurance = function(n) {
    var rankCount = this.getRankCount(),
        matchedRanks = [];

    for (var rank in rankCount) {
        if (rankCount.hasOwnProperty(rank)) {
            if (rankCount[rank] === n) {
                matchedRanks.push(parseInt(rank, 10));
            }
        }
    }
    // if low straight, special case
    if (n === 1 && this.isLowStraight(this.getOrderedRanks())) {
        return [5,4,3,2,1];
    }

    return matchedRanks.sort(this.numeric).reverse();
};

// return object {value: array, name: string}, where array looks like
// [hand_type, primary, secondary, ...] and allows comparing
// of hand values (highest element in left to right comparison wins).
// name string is a human readable description of the hand
POKER.Hand.prototype.getHandDetails = function () {
    var handDetails = {},
        word = POKER.rankToWord,
        hand = POKER.HAND_TYPE,
        primary, secondary;

    if (this.numSameSuits() === 5 && this.numConnected() === 5) {
        primary = this.getRankByOccurance(1)[0];
        handDetails.name = 'Straight flush, ' + word[primary] + ' high';
        handDetails.value = this.buildValueArray(hand.STRAIGHT_FLUSH, [1]);
        return handDetails;
    }
    if (this.numOfAKind()[0] === 4) {
        primary = this.getRankByOccurance(4)[0];
        handDetails.name = 'Four ' + word[primary] + 's';
        handDetails.value = this.buildValueArray(hand.QUADS, [4, 1]);
        return handDetails;
    }
    if (this.equivIntArrays(this.numOfAKind(), [3,2])) {
        primary = this.getRankByOccurance(3)[0];
        secondary = this.getRankByOccurance(2)[0];
        handDetails.name = 'Fullhouse, ' + word[primary] +
            's over ' + word[secondary] + 's';
        handDetails.value = this.buildValueArray(hand.FULL_HOUSE, [3, 2]);
        return handDetails;
    }
    if (this.numSameSuits() === 5 && this.numConnected() < 5) {
        primary = this.getRankByOccurance(1)[0];
        handDetails.name = 'Flush, ' + word[primary] + ' high';
        handDetails.value = this.buildValueArray(hand.FLUSH, [1]);
        return handDetails;
    }
    if (this.numConnected() === 5 && this.numSameSuits() < 5) {
        primary = this.getRankByOccurance(1)[0];
        handDetails.name = 'Straight, ' + word[primary] + ' high';
        handDetails.value = this.buildValueArray(hand.STRAIGHT, [1]);
        return handDetails;
    }
    if (this.equivIntArrays(this.numOfAKind(), [3,1,1])) {
        primary = this.getRankByOccurance(3)[0];
        handDetails.name = 'Three ' + word[primary] + 's';
        handDetails.value = this.buildValueArray(hand.TRIPS, [3, 1]);
        return handDetails;
    }
    if (this.equivIntArrays(this.numOfAKind(), [2,2,1])) {
        primary = this.getRankByOccurance(2)[0];
        secondary = this.getRankByOccurance(2)[1];
        handDetails.name = 'Two pair, ' +  word[primary] + 's over ' +
            word[secondary] + 's';
        handDetails.value = this.buildValueArray(hand.TWO_PAIR, [2, 1]);
        return handDetails;
    }
    if (this.equivIntArrays(this.numOfAKind(), [2,1,1,1])) {
        primary = this.getRankByOccurance(2)[0];
        handDetails.name = 'Pair of ' + word[primary] + 's';
        handDetails.value = this.buildValueArray(hand.PAIR, [2, 1]);
        return handDetails;
    }
    primary = this.getRankByOccurance(1)[0];
    handDetails.name = 'High card ' + word[primary];
    handDetails.value = this.buildValueArray(hand.HIGH_CARD, [1]);
    return handDetails;

};

POKER.Hand.prototype.buildValueArray = function(handType, rankOccurances) {
    var value = [handType];
    for (var idx = 0; idx < rankOccurances.length; idx += 1) {
        value = value.concat(this.getRankByOccurance(rankOccurances[idx]));
    }
    return value;
};

POKER.Hand.prototype.toString = function() {
    var str = '';
    for (var idx = 0; idx < this.cards.length; idx += 1) {
        str += this.cards[idx].toString() + ' ';
    };
    return str.slice(0, str.length - 1);
}

POKER.Hand.prototype.numeric = function(a, b) {
    return a - b;
}

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
POKER.Deck = function() {
    var cards = [],
        dealt = [];

    createCards();

    function createCards() {
        for (var suitIdx = 0; suitIdx < 4; suitIdx += 1) {
            for (var rankIdx = 2; rankIdx < 15; rankIdx += 1) {
                cards.push(new POKER.Card(rankIdx, suitIdx));
            }
        }
    }

    this.size = function() {
        return cards.length;
    };

    // return numCards from deck (or less if deck exhausted)
    this.deal = function(numCards) {
        var cardArray = [],
            len = Math.min(numCards, cards.length);
        for (var idx = 0; idx < len; idx += 1) {
            card = cards.pop();
            cardArray.push(card);
            dealt.push(card);
        }
        return cardArray;
    };

    // shuffle the deck (implicitly returns deck to full size)
    this.shuffle = function() {
        returnDealtCards();
        // shuffle the deck
        fyShuffle(cards);
    };

    function returnDealtCards() {
        var len = dealt.length;
        while (len--) {
            cards.push(dealt.pop());
        }
    }

    // Fisher-Yates shuffle code found at:
    // http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    // swap each element in cards with a random other element
    function fyShuffle(array) {
        var counter = array.length, temp, index;
        while (counter > 0) {
            index = Math.floor(Math.random() * counter);
            counter--;
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }

    this.toString = function() {
        return cards.toString();
    };
};

// compare an array of Hands and return the winner(s) in an array
POKER.getWinners = function(hands) {
    var numberValues = getNumberValues(hands),
        winningHandValue = Math.max.apply(Math, numberValues),
        winnerIndices = getIndicesOfMatching(numberValues, winningHandValue);

    return getWinningHands(winnerIndices);

    // map the hands onto an array of comparable number values
    function getNumberValues(hands) {
        var numberValues = [],
            valueArray;
        for (var idx = 0; idx < hands.length; idx += 1) {
            valueArray = hands[idx].getHandDetails().value;
            numberValues.push(handValueToNumber(valueArray));
        };
        return numberValues;
    }

    // convert a hand value from an array to a fixed number
    // eg: [12,3,4] => 1203040000
    function handValueToNumber(valueArray) {
        var strArray = [],
            paddedValueArray = valueArray.concat([0,0,0,0,0]).slice(0,6);
        for (var idx = 0; idx < paddedValueArray.length; idx += 1) {
            strArray.push(('0' + paddedValueArray[idx]).slice(-2));
        }
        return parseInt(strArray.join(''), 10);
    }


    // return all indices of array whose value === val (empty array if none)
    function getIndicesOfMatching(array, val) {
        var idx = array.length,
            indices = [];
        while (idx--) {
            if (array[idx] === val) {
                indices.push(idx);
            }
        }
        return indices;
    }

    function getWinningHands(winnerIndices) {
        var winningHands = [];
        for (var idx = 0; idx < winnerIndices.length; idx += 1) {
            winningHands.push(hands[winnerIndices[idx]]);
        }
        return winningHands;
    }

};

// if in Node.js environment export the POKER namespace
if (typeof exports !== 'undefined') {
    exports.POKER = POKER;
}
