const shortid = require('shortid');
const ObjectClass = require('./statonaryObject');
const Constants = require('../shared/constants');
const Game = require('./game');

class Gold extends ObjectClass {
  constructor(parentID, x, y) {
    super(shortid(), x, y);
    this.parentID = parentID;
  }

  // Returns true if the gold should be destroyed, TODO
  update(gold) {
    for (let i = 0; i < Game.players.length; i++) {
      if(Game.players[i].distanceTo(gold) <= Constants.COLLECTION_DISTANCE){
        return true;
      }
    }
    return false;
  }
}

module.exports = Gold;
