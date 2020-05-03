const shortid = require('shortid');
const Constants = require('../shared/constants');
const Game = require('./game');
const ObjectClass = require('./object');

class Gold extends ObjectClass {
  constructor(parentID, x, y) {
    super(parentID, x, y, 0, 0);
    this.parentid = parentID;
  }
}

module.exports = Gold;
