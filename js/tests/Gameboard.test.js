import Gameboard from '../Gameboard.js';

describe('Initializes Gameboard', () => {
  it('Gives an empty board when created', () => {
    expect(new Gameboard().board[0][0]).toBe(undefined);
    expect(new Gameboard().board[5][5]).toBe(undefined);
  });
  it('Gives an empty guessing board', () => {
    expect(new Gameboard().guessingBoard[5][5]).toBe(undefined);
    expect(new Gameboard().guessingBoard[9][9]).toBe(undefined);
  });
});

describe('Placing ships', () => {
  const testBoard = new Gameboard();
  it("Places the ship horizontally if direction hasn't been specified", () => {
    testBoard.placeShip(4, [0, 0]);
    expect(testBoard.board[0][0]).not.toBe(undefined);
    expect(testBoard.board[1][0]).toBe(undefined);
  });
  it('Places the ship vertically if it has been specified', () => {
    testBoard.placeShip(3, [5, 5], 'vertical');
    expect(testBoard.board[5][5]).not.toBe(undefined);
    expect(testBoard.board[5][6]).toBe(undefined);
    expect(testBoard.board[7][5]).not.toBe(undefined);
  });
  it('Places the ship of provided length', () => {
    expect(testBoard.board[0][3]).not.toBe(undefined);
    expect(testBoard.board[0][4]).toBe(undefined);
  });
  it("Can't place a ship outside of the board", () => {
    expect(() => testBoard.placeShip(4, [0, 10])).toThrow(
      "Can't place a ship out of bounds."
    );
  });
  it("Can't place a ship of length that surpasses the board", () => {
    expect(() => testBoard.placeShip(4, [0, 7])).toThrow(
      'This ship surpasses the board and cannot be placed.'
    );
  });
  it("Can't place a ship over another ship", () => {
    expect(() => testBoard.placeShip(3, [5, 4])).toThrow(
      'Cannot place a ship over another one.'
    );
  });
});

describe('Receiving Attacks', () => {
  const testBoard = new Gameboard();
  testBoard.placeShip(4, [0, 0]);
  it('Returns true if the ship has been hit', () => {
    expect(testBoard.receiveAttack([0, 0])).toBe(true);
  });
  it('Increases the number of hits a ship has', () => {
    expect(testBoard.board[0][0].hits).toBe(1);
  });
  it('Returns false if no ship has been hit', () => {
    expect(testBoard.receiveAttack([0, 4])).toBe(false);
  });
});

describe('Checking if game is over', () => {
  const testBoard = new Gameboard();
  testBoard.placeShip(1, [0, 0]);
  it('Returns false when there are still ships to be hit', () => {
    expect(testBoard.isGameOver()).toBe(false);
  });
  it('Returns true when all the ships have been sunk', () => {
    expect(testBoard.receiveAttack([0, 0]));
    expect(testBoard.isGameOver()).toBe(true);
  });
});
