/*global describe, it */
'use strict';
(function () {
    var should = require('should');
    var POKER = require('../lib/poker.js').POKER;
    var tripAces, flush, straight, lowStraight;

    beforeEach(function() {
        tripAces = POKER.handFromString('As Ah Ad Ks 3c');
        flush = POKER.handFromString('7s 6s As Ks 3s');
        straight = POKER.handFromString('7s 6s 4c 3h 5s');
        lowStraight = POKER.handFromString('As 2s 4c 3h 5s');
    });

    describe('Testing POKER module', function () {
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

    });
})();
