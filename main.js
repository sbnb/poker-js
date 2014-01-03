var POKER = require('./lib/poker.js').POKER;
var assertCount = 0;
var assertionsPassed = 0;

var tripAces = POKER.handFromString('As Ah Ad Ks 3c'),
    flush = POKER.handFromString('7s 6s As Ks 3s'),
    straight = POKER.handFromString('7s 6s 4c 3h 5s'),
    lowStraight = POKER.handFromString('As 2s 4c 3h 5s');

console.log('straight.getOrderedRanks()', straight.getOrderedRanks());
console.log('lowStraight.getOrderedRanks()', lowStraight.getOrderedRanks());

assert(tripAces.numSameSuits() === 2, 'expect two same suits: ' + tripAces);
assert(flush.numSameSuits() === 5, 'expect five same suits: ' + flush);

assert(equivIntArrays(straight.getOrderedRanks(), [3,4,5,6,7]), 'expect ranks 3..7: ' + straight)
assert(equivIntArrays(flush.getOrderedRanks(), [3,6,7,13,14]), 'expect ranks 3,6,7,13,14: ' + flush)

assert(straight.numConnected() === 5, 'expect five connected: ' + straight);
assert(lowStraight.numConnected() === 5, 'expect five connected: ' + lowStraight);
assert(flush.numConnected() === 2, 'expect two connected: ' + flush);

console.log('--------\n' + assertionsPassed + ' of ' + assertCount + ' assertions passed');

function assert(expression, message) {
    assertCount += 1;
    if (!expression) {
        console.log('ASSERT FAILS: ' + message);
    }
    else {
        assertionsPassed += 1;
    }
}

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