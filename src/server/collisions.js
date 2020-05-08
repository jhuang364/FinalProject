const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets, huts) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeBulletDamage();
        break;
      }
    }
  }
  for (let i = 0; i < bullets.length; i++) {
    // Look for a hut (whose owner did not create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < huts.length; j++) {
      const bullet = bullets[i];
      const hut = huts[j];
      if (
        bullet.parentID !== hut.id &&
        hut.distanceTo(bullet) <= Constants.HUT_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        hut.takeBulletDamage();
        break;
      }
    }
  }
  return destroyedBullets;
}

module.exports = applyCollisions;
