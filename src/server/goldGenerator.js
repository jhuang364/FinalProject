const Gold = require('./object');
const Constants = require('../shared/constants');
class GoldGenerator {
  constructor() {
    this.generateCooldown = 0;
    this.id = 0;
  }

  update(dt) {
    this.generateCooldown -= dt;
    if (this.generateCooldown <= 0) {
      this.fireCooldown += Constants.GENERATE_COOLDOWN;
      this.id += 1;
      return new Gold(this.id, 5000 * Math.random(), 5000 * Math.random());
    }
    
    return null;
  }
}

module.exports = GoldGenerator;