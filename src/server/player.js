const ObjectClass = require('./object');
const Gold = require('./gold')
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.gold = 0;
    this.hp = Constants.PLAYER_MAX_HP;
    this.score = 0;
  }

  update(dt) {
    super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));
  }

  addGold() {
    this.gold += 1;
    console.log("Gold added!")
  }
  
  spendGold(cost) {
    if(this.gold < cost) {
      return false;
    }
    this.gold -= cost;
    return true;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      gold: this.gold,
    };
  }
}

module.exports = Player;
