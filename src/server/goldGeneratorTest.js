const Player = require('./player');
const Gold = require('./gold');
const Constants = require('../shared/constants');

describe('Player', () => {
    describe('update', () => {
      it('should generate gold after cooldown', () => {
        const player = new Player('123', 'guest');
  
        expect(player.update(Constants.GENERATE_COOLDOWN / 3))
          .toBeInstanceOf(Gold);
      });
  
      it('should not fire bullet during cooldown', () => {
        const player = new Player('123', 'guest');
  
        player.update(Constants.GENERATE_COOLDOWN / 3);
  
        expect(player.update(Constants.GENERATE_COOLDOWN / 3)).toBe(null);
        });
    });
});