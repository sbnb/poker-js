Poker library
=============

A convenience library for writing poker related programs, written in JavaScript.

Provides the following objects in the POKER namespace.

- Deck
- Card
- Hand

and the function POKER.getWinners(hands)

##Including in your code

####As a node module:

1. clone the repo or download poker.js
2. include the POKER object into your code

    var POKER = require('path/to/poker.js').POKER;
    
####In a browser application:

    <script src="path/to/poker.js"></script>

Either way the POKER namespace is created.

##Usage

####Create some specific hands

    var tripAces = POKER.handFromString('As Ah Ad Ks 3c'),
        flush = POKER.handFromString('7s 6s As Ks 3s'),
        straight = POKER.handFromString('7s 6s 4c 3h 5s'),
        lowStraight = POKER.handFromString('As 2s 4c 3h 5s');
    
    var winner = POKER.getWinners([tripAces, flush, straight, lowStraight]);
    // winner == [flush]
    
    winner = POKER.getWinners([flush, straight]);
    // winner == [flush]
    
    winner = POKER.getWinners([lowStraight, straight]);
    // winner == [straight]

####Deal some hands from a deck

    var deck = new POKER.Deck(),
        hands = [];
    
    for (var idx = 0; idx < 6; idx += 1) {
        hands[idx] = new POKER.Hand(deck.deal(5));
    };
    
    // find the winner/s
    var winner = POKER.getWinners(hands);
    



 
####Further details

See [this article](link)