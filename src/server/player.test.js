const Player = require('./player');
const Constants = require('../shared/constants');

describe('Player', () => {
  describe('update', () => {
    it('should gain score each second', () => {
      const player = new Player('123', 'guest');
      const initialScore = player.score;

      player.update(1);

      expect(player.score).toBeGreaterThan(initialScore);
    });
  });
  describe('addGold', () => {
    it('should take damage when hit', () => {
      const player = new Player('123', 'guest');

      const gold = player.gold;

      player.addGold();

      expect(player.gold).toBeGreaterThan(gold);
    });
  });
  describe('serializeForUpdate', () => {
    it('include hp, gold, and direction in serialization', () => {
      const player = new Player('123', 'guest');

      expect(player.serializeForUpdate())
        .toEqual(expect.objectContaining({
          hp: Constants.PLAYER_MAX_HP,
          gold: expect.any(number),
          direction: expect.any(Number),
        }));
    });
  });
});
