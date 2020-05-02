class stationaryObject {
    constructor(id, x, y) {
      this.id = id;
      this.x = x;
      this.y = y;
    }
  
    distanceTo(object) {
      const dx = this.x - object.x;
      const dy = this.y - object.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    serializeForUpdate() {
      return {
        id: this.id,
        x: this.x,
        y: this.y,
      };
    }
  }
  
  module.exports = Object;
  