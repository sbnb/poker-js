/*global describe, it */
'use strict';
(function () {
    var should = require('should');
    var POKER = require('../lib/poker.js').POKER;
    var tripAces, flush, straight, lowStraight;
    var handStrings = {
        straightFlushes: ['As 2s 3s 4s 5s', '7d 8d 9d Td Jd', 'Ah Kh Qh Jh Th'],
        quads: ['2s 2d 2h 2c Ac', '7d As Ac Ad Ah', 'Jd Jh 4s Js Jc'],
        fullHouses: ['As Ah Ad Ks Kc', '3s 2h 3s 2d 2c', '5d 5h Ks Kd Kh'],
        flushes: ['6h 7h Ah 3h 9h', '2s 3s 9s Js 5s', 'Td 3d Ad Kd Qd'],
        straights: ['Ad 2s 5d 4s 3c', '7s 8d 9h Th Js', 'As Jh Ts Qd Kc'],
        trips: ['7s 7c 7d 6h 2d', 'As 3h 5d Ac Ad', '5s Jd Qh Qd Qs'],
        twoPairs: ['2s 2c Ts Td Jh', '7s 9s Ad 9h 7c', 'Ad As 7h Kh Kd'],
        pairs: ['As Ad 7c 3s 4d', 'Jd 8h 2d Ts Jc', 'Ts 9s 8s 7s 9c'],
        highCards: ['Ad Qh 9s 4c 2h', '5h 6h Ts 2s Jh', '9s Ts Js Qs Ad']
    };
    var hands;
    var hType = POKER.HAND_TYPE;

    beforeEach(function() {
        tripAces = POKER.handFromString('As Ah Ad Ks 3c');
        flush = POKER.handFromString('7s 6s As Ks 3s');
        straight = POKER.handFromString('7s 6s 4c 3h 5s');
        lowStraight = POKER.handFromString('As 2s 4c 3h 5s');
        hands = makeHands(handStrings);
    });

    describe('Testing POKER module', function () {
        describe('POKER.getWinners()', function () {
            it('flush beats a straight', function () {
                var winner = POKER.getWinners([flush, straight]);
                winner.length.should.equal(1);
                winner[0].should.equal(flush);
            });

            it('quads is best hand', function () {
                var winner = POKER.getWinners([flush, straight, hands.quads[0]]);
                winner.length.should.equal(1);
                winner[0].should.equal(hands.quads[0]);
            });

            it('split winners', function () {
                var winner = POKER.getWinners([flush, straight, flush]);
                winner.length.should.equal(2);
                winner[0].should.equal(flush);
                winner[1].should.equal(flush);
            });

            it('three nines should beat three sevens', function () {
                var nines = POKER.handFromString('9c 9d 9s 4d 2h'),
                    sevens = POKER.handFromString('7s 7d 7h Kc 5h'),
                    winner = POKER.getWinners([nines, sevens]);
                winner.length.should.equal(1, 'expect one winner');
                winner[0].should.equal(nines);

            });

        });

        describe('POKER.Hand.numSameSuits()', function () {
            it('trip aces should have two same suits', function () {
                tripAces.numSameSuits().should.equal(2);
            });

            it('flush should have five same suits', function () {
                flush.numSameSuits().should.equal(5);
            });

        });

        describe('POKER.Hand.getOrderedRanks()', function () {
            it('straight should have 5 consecutive ordered ranks', function () {
                straight.getOrderedRanks().should.eql([3,4,5,6,7]);
            });

            it('flush ordered ranks should not be consecutive', function () {
                flush.getOrderedRanks().should.eql([3,6,7,13,14]);
            });
        });

        describe('POKER.Hand.numConnected()', function () {
            it('straight should have 5 connected ranks', function () {
                straight.numConnected().should.equal(5);
            });

            it('low straight should have 5 connected ranks', function () {
                lowStraight.numConnected().should.equal(5);
            });

            it('flush should have 2 connected ranks', function () {
                flush.numConnected().should.equal(2);
            });
        });

        describe('POKER.Hand.numOfAKind()', function () {
            it('straight should have [1,1,1,1,1] as num of a kind', function () {
                straight.numOfAKind().should.eql([1,1,1,1,1]);
            });

            it('tripAces should have [3,1,1] as num of a kind', function () {
                tripAces.numOfAKind().should.eql([3,1,1]);
            });

            it('fullhouse should have [3,2] as num of a kind', function () {
                hands.fullHouses[0].numOfAKind().should.eql([3,2]);
            });

            it('quads should have [4,1] as num of a kind', function () {
                hands.quads[0].numOfAKind().should.eql([4,1]);
            });

            it('two pair should have [2,2,1] as num of a kind', function () {
                hands.twoPairs[0].numOfAKind().should.eql([2,2,1]);
            });

            it('pair should have [2,1,1,1] as num of a kind', function () {
                hands.pairs[0].numOfAKind().should.eql([2,1,1,1]);
            });
        });

        describe('recognise poker hands', function () {
            it('should recognise straight flushes', function () {
                allSameHandType(hands['straightFlushes'], hType.STRAIGHT_FLUSH);
            });

            it('should recognise quads', function () {
                allSameHandType(hands['quads'], hType.QUADS);
            });

            it('should recognise fullHouses', function () {
                allSameHandType(hands['fullHouses'], hType.FULL_HOUSE);
            });

            it('should recognise flushes', function () {
                allSameHandType(hands['flushes'], hType.FLUSH);
            });

            it('should recognise straights', function () {
                allSameHandType(hands['straights'], hType.STRAIGHT);
            });

            it('should recognise trips', function () {
                allSameHandType(hands['trips'], hType.TRIPS);
            });

            it('should recognise two pairs', function () {
                allSameHandType(hands['twoPairs'], hType.TWO_PAIR);
            });

            it('should recognise pairs', function () {
                allSameHandType(hands['pairs'], hType.PAIR);
            });

            it('should recognise high cards', function () {
                allSameHandType(hands['highCards'], hType.HIGH_CARD);
            });
        });

        describe('get hand values', function () {
            var handDetails;

            it('straight flush should have value [STRAIGHT_FLUSH,5,4,3,2,1]', function () {
                // 'As 2s 3s 4s 5s'
                handDetails = hands['straightFlushes'][0].getHandDetails();
                handDetails.value.should.eql([hType.STRAIGHT_FLUSH,5,4,3,2,1]);
                handDetails.name.should.equal('Straight flush, five high');
            });

            it('quads should have value [QUADS,2,14]', function () {
                // '2s 2d 2h 2c Ac'
                handDetails = hands['quads'][0].getHandDetails();
                handDetails.value.should.eql([hType.QUADS,2,14]);
                handDetails.name.should.equal('Four twos');
            });

            it('fullhouse should have value [FULL_HOUSE,14,13]', function () {
                // 'As Ah Ad Ks Kc'
                handDetails = hands['fullHouses'][0].getHandDetails();
                handDetails.value.should.eql([hType.FULL_HOUSE,14,13]);
                handDetails.name.should.equal('Fullhouse, aces over kings');
            });

            it('flush should have value [FLUSH,14,13,7,6,3]', function () {
                // '7s 6s As Ks 3s'
                handDetails = flush.getHandDetails();
                handDetails.value.should.eql([hType.FLUSH,14,13,7,6,3]);
                handDetails.name.should.equal('Flush, ace high');
            });

            it('straight should have value [STRAIGHT,7,6,5,4,3]', function () {
                // '7s 6s 4c 3h 5s'
                handDetails = straight.getHandDetails();
                handDetails.value.should.eql([hType.STRAIGHT,7,6,5,4,3]);
                handDetails.name.should.equal('Straight, seven high');
            });

            it('low straight should have value [STRAIGHT,5,4,3,2,1]', function () {
                // 'As 2s 4c 3h 5s'
                handDetails = lowStraight.getHandDetails();
                handDetails.value.should.eql([hType.STRAIGHT,5,4,3,2,1]);
                handDetails.name.should.equal('Straight, five high');
            });

            it('trip aces should have value [TRIPS,14,13,3]', function () {
                // 'As Ah Ad Ks 3c'
                handDetails = tripAces.getHandDetails();
                handDetails.value.should.eql([hType.TRIPS,14,13,3]);
                handDetails.name.should.equal('Three aces');
            });

            it('two pair should have value [TWO_PAIR,10,2,11]', function () {
                // '2s 2c Ts Td Jh'
                handDetails = hands['twoPairs'][0].getHandDetails();
                handDetails.value.should.eql([hType.TWO_PAIR,10,2,11]);
                handDetails.name.should.equal('Two pair, tens over twos');
            });

            it('pair should have value [PAIR,14,7,4,3]', function () {
                // 'As Ad 7c 3s 4d'
                handDetails = hands['pairs'][0].getHandDetails();
                handDetails.value.should.eql([hType.PAIR,14,7,4,3]);
                handDetails.name.should.equal('Pair of aces');
            });

            it('high card should have value [HIGH_CARD,14,12,9,4,2]', function () {
                // 'Ad Qh 9s 4c 2h'
                handDetails = hands['highCards'][0].getHandDetails();
                handDetails.value.should.eql([hType.HIGH_CARD,14,12,9,4,2]);
                handDetails.name.should.equal('High card ace');
            });
        });

        describe('POKER.Hand.getRankByOccurance()', function () {
            it('straights have 5 distinct cards', function () {
                // '7s 6s 4c 3h 5s'
                straight.getRankByOccurance(1).should.eql([7,6,5,4,3]);
            });

            it('two pairs have 2 ranks occurring twice each', function () {
                // '2s 2c Ts Td Jh'
                hands['twoPairs'][0].getRankByOccurance(2).should.eql([10, 2]);
            });
        });

        describe('POKER.Deck', function () {
            var deck;

            beforeEach(function() {
                deck = new POKER.Deck();
            });

            it('should be a full deck after creation', function () {
                deck.size().should.equal(52);
            });

            it('should deal cards on request', function () {
                var cards = deck.deal(5);
                deck.size().should.equal(47);
                cards.length.should.equal(5);
            });

            it('should deal only as many cards as in deck', function () {
                var cards = deck.deal(100);
                deck.size().should.equal(0);
                cards.length.should.equal(52);
            });

            it('should shuffle cards on request', function () {
                var preShuffle = deck.toString();
                deck.shuffle();
                var postShuffle = deck.toString();
                preShuffle.should.not.equal(postShuffle);
            });

            it('shuffled deck should be full again', function () {
                deck.deal(10);
                deck.shuffle();
                deck.size().should.equal(52);
            });
        });


    });

    // create object where key is hand type (e.g. 'trips'), and value is an
    // array of Hand objects corresponding to that hand type
    function makeHands(handStrings) {
        var hands = {},
            hand;
        for (var handType in handStrings) {
            if (handStrings.hasOwnProperty(handType)) {
                // create corresponding key in hands
                hands[handType] = [];
                for (var idx = 0; idx < handStrings[handType].length; idx += 1) {
                    hand = POKER.handFromString(handStrings[handType][idx]);
                    hands[handType].push(hand);
                };
            }
        }
        return hands;
    }

    function allSameHandType(hands, expectedHandType) {
        for (var idx = 0; idx < hands.length; idx += 1) {
            hands[idx].getHandDetails().value[0].should.equal(expectedHandType, hands[idx]);
        };
    }
})();
