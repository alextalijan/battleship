import Ship from './Ship.js';
import PubSub from './PubSub.js';

class Gameboard {
  constructor() {
    this.board = new Array(10);
    this.guessingBoard = new Array(10);

    for (let i = 0; i < 10; i += 1) {
      this.board[i] = new Array(10);
      this.guessingBoard[i] = new Array(10);
    }

    this.ships = 0;
  }

  placeShip(length, startingPoint, direction = 'horizontal') {
    if (
      startingPoint[0] < 0 ||
      startingPoint[0] > this.board.length - 1 ||
      startingPoint[1] < 0 ||
      startingPoint[1] > this.board[0].length - 1
    ) {
      throw new Error("Can't place a ship out of bounds.");
    }

    const ship = new Ship(length);
    if (direction === 'horizontal') {
      // Check if size of the ship surpasses the board from the starting point
      if (startingPoint[1] + length > this.board[0].length) {
        throw new Error('This ship surpasses the board and cannot be placed.');
      }

      // If there are already ships that this one would overlap, stop it from happening
      if (this.#areThereShips(length, startingPoint, direction)) {
        throw new Error('Cannot place a ship over another one.');
      }

      // Place the ship in appropriate spots
      for (let j = startingPoint[1]; length > 0; j += 1) {
        this.board[startingPoint[0]][j] = ship;
        length -= 1;
      }

      this.ships += 1;
    } else if (direction === 'vertical') {
      if (startingPoint[0] + length > this.board.length) {
        throw new Error('This ship is too big to fit on the board.');
      }

      if (this.#areThereShips(length, startingPoint, direction)) {
        throw new Error('Cannot place a ship over another one.');
      }

      for (let i = startingPoint[0]; length > 0; i += 1) {
        this.board[i][startingPoint[1]] = ship;
        length -= 1;
      }

      this.ships += 1;
    }
  }

  // Go through all the spots a ship could be at, and return true if there is one
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

  // This function returns true if there was a hit, otherwise false
  receiveAttack(coordinates) {
    const target = this.board[coordinates[0]][coordinates[1]];
    if (target instanceof Ship) {
      target.hit();
      if (target.isSunk) {
        this.ships -= 1;
        if (this.isGameOver()) {
          PubSub.publish('gameOver', this.board);
          return;
        }
      }

      return true;
    }

    return false;
  }

  isGameOver() {
    if (this.ships < 1) return true;

    return false;
  }
}

export default Gameboard;
