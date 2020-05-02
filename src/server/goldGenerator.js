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
      return new Gold(this.id, 0.25 + Math.random() * 0.5, 0.25 + Math.random() * 0.5);
    }
    
    return null;
  }
}

module.exports = GoldGenerator;