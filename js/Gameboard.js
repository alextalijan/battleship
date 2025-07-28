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

  placeShip(length, startingPoint, direction = 'horizontal') {
    if (
      startingPoint[0] < 0 ||
      startingPoint[0] > 9 ||
      startingPoint[1] < 0 ||
      startingPoint[1] > 9
    ) {
      throw new Error("Can't place a ship out of bounds.");
    }

    const ship = new Ship(length);
    if (direction === 'horizontal') {
      if (startingPoint[1] + length > 10) {
        throw new Error('This ship surpasses the board and cannot be placed.');
      }

      if (this.#areThereShips(length, startingPoint, direction)) {
        throw new Error('Cannot place a ship over another one.');
      }

      for (let j = startingPoint[1]; length > 0; j += 1) {
        this.board[startingPoint[0]][j] = ship;
        length -= 1;
      }
    } else if (direction === 'vertical') {
      if (startingPoint[0] + length > 10) {
        throw new Error('This ship is too big to fit on the board.');
      }

      if (this.#areThereShips(length, startingPoint, direction)) {
        throw new Error('Cannot place a ship over another one.');
      }

      for (let i = startingPoint[0]; length > 0; i += 1) {
        this.board[i][startingPoint[1]] = ship;
        length -= 1;
      }
    }
  }

  #areThereShips(length, startingPoint, direction) {
    if (direction === 'horizontal') {
      for (let j = startingPoint[1]; length > 0; j += 1) {
        if (this.board[startingPoint[0]][j] !== undefined) {
          return true;
        }
        length -= 1;
      }
    } else {
      for (let i = startingPoint[0]; length > 0; i += 1) {
        if (this.board[i][startingPoint[1]] !== undefined) {
          return true;
        }
        length -= 1;
      }
    }

    return false;
  }

  receiveAttack(coordinates) {
    const target = this.board[coordinates[0]][coordinates[1]];
    if (target instanceof Ship) {
      target.hit();
      return true;
    }

    return false;
  }
}

export default Gameboard;
