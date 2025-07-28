import Gameboard from './Gameboard.js';

class Player {
  constructor(type) {
    if (type !== 'real' && type !== 'computer') {
      throw new Error('You can only chose "real" or "computer" players.');
    }

    this.type = type;
    this.gameboard = new Gameboard();
  }
}

export default Player;
