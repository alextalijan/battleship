import Ship from './Ship.js';

class Gameboard {
  constructor() {
    this.board = new Array(10);
    this.guessingBoard = new Array(10);

    for (let i = 0; i < 10; i += 1) {
      this.board[i] = new Array(10);
      this.guessingBoard[i] = new Array(10);
    }
  }

  placeShip(length, coordinates, direction = 'horizontal') {
    if (
      coordinates[0] < 0 ||
      coordinates[0] > 9 ||
      coordinates[1] < 0 ||
      coordinates[1] > 9
    ) {
      throw new Error("Can't place a ship out of bounds.");
    }

    const ship = new Ship(length);
    if (direction === 'horizontal') {
      for (let j = coordinates[0]; length > 0; j += 1) {
        this.board[coordinates[0]][j] = ship;
        length -= 1;
      }
    } else if (direction === 'vertical') {
      for (let i = coordinates[0]; length > 0; i += 1) {
        this.board[i][coordinates[1]] = ship;
        length -= 1;
      }
    }
  }
}

export default Gameboard;
