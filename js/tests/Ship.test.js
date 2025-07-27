import Ship from '../Ship.js';

describe('Ship Length', () => {
  it('Is of inputed length', () => {
    expect(new Ship(4).length).toBe(4);
  });
  it("Can't be of length less than one", () => {
    expect(() => new Ship(0)).toThrow();
  });
});

const hitMock = jest.fn((ship) => (ship.hits += 1));

describe('Number of hits', () => {
  const testShip = new Ship(5);
  it('Shows the number of hits as 0 when ship is created', () => {
    expect(testShip.hits).toBe(0);
  });
});

describe('Has it been sunk', () => {
  const testShip = new Ship(3);
  it("Shows the ship hasn't sunk when it hadn't been", () => {
    hitMock(testShip);
    expect(testShip.isSunk).toBe(false);
  });

  it('Shows when the ship has been sunk', () => {
    hitMock(testShip);
    hitMock(testShip);
    expect(testShip.isSunk).toBe(true);
  });
});

describe('Ship being hit', () => {
  const testShip = new Ship(4);
  it('Increases hits by 1 when the ship has been hit', () => {
    testShip.hit();
    expect(testShip.hits).toBe(1);
  });
});
