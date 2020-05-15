const Constants = require('../shared/constants');
const Player = require('./player');
const GoldGenerator = require('./goldGenerator');
const Hut = require('./hut');
const Bullet = require('./bullet');
const applyCollisions = require('./collisions');


class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.golds = [];
    this.bullets = [];
    this.huts = {};
    this.goldGenerator = new GoldGenerator();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (Math.random() * 0.99);
    const y = Constants.MAP_SIZE * (Math.random() * 0.99);
    this.players[socket.id] = new Player(socket.id, username, x, y);
    this.huts[socket.id] = this.players[socket.id].hut;
  }

  removePlayer(socket) {
    delete this.huts[socket.id];
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));
    
    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    
    // Apply collisions
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets, Object.values(this.huts));
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));


    // Generate gold  
    const newGold = this.goldGenerator.update(dt);
    if(newGold && this.golds.length < Constants.MAX_MAP_GOLD) {
      this.golds.push(newGold);
    }

    // Update each gold piece
    const goldToRemove = [];
    this.golds.forEach(gold => {
        Object.keys(this.sockets).forEach(playerID => {
          const player = this.players[playerID];
          const hut = this.huts[playerID];
          if(player.distanceTo(gold) <= Constants.COLLECTION_DISTANCE){
            player.addGold();
            hut.restoreHP();
            goldToRemove.push(gold);
          }
        });
    });
    this.golds = this.golds.filter(gold => !goldToRemove.includes(gold));

    // Check if any huts are dead and if player hp = 0
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      const hut = this.huts[playerID];
      if (hut.hp <= 0) {
        destroyedBullets.forEach(b => {
          if (this.players[b.parentID]) {
            this.players[b.parentID].gold += player.gold;
          }
        });
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
      if(player.hp <= 0) {
        destroyedBullets.forEach(b => {
          if (this.players[b.parentID]) {
            this.players[b.parentID].gold += Math.round(player.gold / 3);
            player.gold -= Math.round(player.gold / 3);
          }
        });
        player.x = hut.x;
        player.y = hut.y;
        player.hp = Constants.PLAYER_MAX_HP;
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, gold: p.gold }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyGolds = this.golds.filter(
      g => g.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyHuts = Object.values(this.huts).filter(
      h => h.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      golds: nearbyGolds.map(g => g.serializeForUpdate()),
      huts: nearbyHuts.map(h => h.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
