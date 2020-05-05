const shortid = require('shortid');
const Constants = require('../shared/constants');
const Game = require('./game');
const ObjectClass = require('./object');

class Hut extends ObjectClass {
  constructor(parentID, x, y) {
    super(parentID, x, y, 0, 0);
    this.parentid = parentID;
    this.hp = Constants.HUT_MAX_HP;
    this.gold = 0;
    this.huts = [];
  }
}

module.exports = Hut;
