const ObjectClass = require('./object');
const Gold = require('./gold')
const Hut = require('./hut')
const Constants = require('../shared/constants');
const Bullet = require('./bullet');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.gold = 0;
    this.hp = Constants.PLAYER_MAX_HP;
    this.score = 0;
    this.hut = new Hut(id, x, y);
    this.fireCooldown = 0;
    this.regenCooldown = 0;
  }

  update(dt) {
    super.update(dt);

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    this.regenCooldown -= dt;
    if (this.regenCooldown <= 0) {
      this.regenCooldown += Constants.PLAYER_REGEN_COOLDOWN;
      this.hp += Math.min(Constants.PLAYER_REGEN_PER_SECOND, Constants.PLAYER_MAX_HP - this.hp);
    }

    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(this.id, this.x, this.y, this.direction);
    }
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

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
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
