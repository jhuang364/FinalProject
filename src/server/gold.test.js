const Gold = require('./gold');
const Player = require('./player');
const Constants = require('../shared/constants');

describe('Gold', () => {
  describe('update', () => {

    it('should be destroyed if a player is close enough', () => {
      const x = 1;
      const y = 1;
      const gold = new Gold('test-parent-id', x, y);
      const player = new Player('123', 'guest', x, y);
      expect(gold.update(gold)).toBe(true);
    });
    it('should not be destroyed if all players are too far', () => {
      const x = 1;
      const y = 1;
      const gold = new Gold('test-parent-id', x, y);
      const player = new Player('123', 'guest', x, y);

      expect(gold.update(gold)).toBe(false);
    });
  });
});
