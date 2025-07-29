const Game = function thatRepresentsTheWholeGame(players) {
  for (const player of players) {
    const shipLengths = [5, 4, 3, 3, 2];

    while (player.gameboard.ships < 5) {
      if (player.type === 'real') {
        let placement = prompt(
          `Where to place the ${shipLengths[player.gameboard.ships]} lengthed ship? E.g. 0,5 vertical -> 1st row, 6th column, placed vertically.`
        );
        placement = placement.split(' ');

        try {
          const move = {
            startingPoint: placement[0].split(','),
            direction: placement[1],
          };
          player.gameboard.placeShip(
            shipLengths[player.gameboard.ships],
            move.startingPoint,
            move.direction
          );
        } catch (error) {
          console.log(error.message);
        }
      } else {
        // If player is a computer, randomly generate its ships
        let i = 0;
        while (i < 5) {
          try {
            player.gameboard.placeShip(
              shipLengths[i],
              [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
              Math.random() < 0.5 ? 'horizontal' : 'vertical'
            );
            i += 1;
          } catch (error) {
            console.log(error.message);
          }
        }
      }
    }
  }
};
