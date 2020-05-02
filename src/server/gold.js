const shortid = require('shortid');
const StationaryObjectClass = require('./stationaryObject');
const Constants = require('../shared/constants');
const Game = require('./game');

class Gold extends StationaryObjectClass {
  constructor(id, x, y) {
    super(x, y);
    this.id = id;
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
