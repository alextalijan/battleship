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

  let turnPlayer = players.unshift();
  while (!turnPlayer.gameboard.isGameOver) {
    // Get the player back in queue again
    players.push(turnPlayer);

    if (turnPlayer.type === 'real') {
      const userInput = prompt(
        'Which spot do you want to attack? E.g. 5,5 -> you would attack 6th row, 6th column.'
      );

      const move = userInput.split(',');
      if (
        move.length === 2 &&
        typeof move[0] === 'number' &&
        typeof move[1] === 'number'
      ) {
        // Only if the move hasn't been made
        if (
          ![true, false].includes(turnPlayer.guessingBoard[move[0]][move[1]])
        ) {
          // Make an attack on the opponents ship
          turnPlayer.guessingBoard[move[0]][move[1]] =
            players[0].gameboard.receiveAttack(move);

          turnPlayer = players.unshift();
        } else {
          alert('That move has already been made. Please choose another.');
        }
      } else {
        alert('Please input the move in a valid format -> x,y');
      }
    }
  }
};
