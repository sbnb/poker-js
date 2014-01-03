var POKER = require('./lib/poker.js').POKER;

console.log('running main.js');

var card = new POKER.Card(10, 3);
console.log('card: ' + card);

var anotherCard = POKER.cardFromString('As');
console.log('anotherCard: ' + anotherCard);
