const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
    this.xInit = x;
    this.yInit = y;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);
    return this.x < 0 || this.y < 0 || this.x > Constants.MAP_SIZE || this.y > Constants.MAP_SIZE ||
    Math.sqrt( Math.pow((this.x - this.xInit), 2) + Math.pow((this.y - this.yInit), 2)) > Constants.BULLET_RANGE;
  }
}

module.exports = Bullet;
