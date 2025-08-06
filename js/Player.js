import Gameboard from './Gameboard.js';

class Player {
  constructor(type, name = 'Computer') {
    if (type !== 'real' && type !== 'computer') {
      throw new Error('You can only choose "real" or "computer" players.');
    }

    this.type = type;
    this.name = name;
    this.gameboard = new Gameboard(10);
  }
}

export default Player;
