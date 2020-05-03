module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,

  MAP_SIZE: 5000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },
  COLLECTION_DISTANCE: 15,
  GENERATE_COOLDOWN: 0.1,
  GOLD_RADIUS: 10
});