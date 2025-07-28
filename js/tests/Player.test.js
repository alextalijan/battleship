import Player from '../Player.js';

describe('Types of players', () => {
  it('Creates a real player', () => {
    expect(new Player('real').type).toBe('real');
  });
  it('Creates a computer player', () => {
    expect(new Player('computer').type).toBe('computer');
  });
  it('Rejects to create any other player', () => {
    expect(() => new Player('fake').type).toThrow(
      'You can only choose "real" or "computer" players.'
    );
  });
});

describe('Own gameboard', () => {
  it('Creates a new gameboard when a player is generated.', () => {
    const player = new Player('real');
    expect(player).toHaveProperty('gameboard');
  });
});
