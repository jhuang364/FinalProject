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
      this.generateCooldown += Constants.GENERATE_COOLDOWN;
      this.id += 1;
      const x = Math.random() * 3000;
      const y = Math.random() * 3000;
      return new Gold(this.id, x, y);
    }
    
    return null;
  }
}

module.exports = GoldGenerator;