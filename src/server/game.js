const Constants = require('../shared/constants');
const Player = require('./player');
const GoldGenerator = require('./goldGenerator');
const Hut = require('./hut');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.golds = [];
    this.goldGenerator = new GoldGenerator();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
    this.huts.push(players[socket.id].hut);
  }

  removePlayer(socket) {
    delete this.huts[players[socket.id].hut]
    //this one below is even more wrong i think
    //this.huts = this.huts.filter(hut => !players[socket.id].hut);
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

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      player.update(dt);
    });
    const newGold = this.goldGenerator.update(dt);
    if(newGold) {
      this.golds.push(newGold);
    }

    // Update each gold piece
    const goldToRemove = [];
    this.golds.forEach(gold => {
        Object.keys(this.sockets).forEach(playerID => {
          const player = this.players[playerID];
          if(player.distanceTo(gold) <= Constants.COLLECTION_DISTANCE){
            player.addGold();
            goldToRemove.push(gold);
          }
        });
    });
    this.golds = this.golds.filter(gold => !goldToRemove.includes(gold));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
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
    const nearbyHuts = this.huts.filter(
      h => h.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      golds: nearbyGolds.map(g => g.serializeForUpdate()),
      huts: nearbyHuts.map(h => h.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
