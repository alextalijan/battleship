import announce from './announce.js';
import PubSub from './PubSub.js';

const Game = (function thatControlsGameplay() {
  const turns = [];

  function getShipPlacementClick() {
    const boardElement = document.querySelector('.game-screen');

    return new Promise((resolve) => {
      // TODO: stop adding event listeners for every new game, and remove them after adding all ships
      boardElement.onclick = (event) => {
        event.stopPropagation();

        const direction = prompt(
          'How do you want to place the ship? horizontal (h) / vertical (v)'
        );

        resolve({
          startingPoint: event.target.dataset.coordinates
            .split(',')
            .map((stringNumber) => Number(stringNumber)),
          direction: direction === 'h' ? 'horizontal' : 'vertical',
        });
      };
    });
  }

  function getPlayerGuess() {
    const boardElement = document.querySelector('.game-screen');

    return new Promise((resolve) => {
      // TODO: make sure this only gets added once, as well as delete after the game is over
      boardElement.onclick = (event) => {
        event.stopPropagation();

        resolve(
          event.target.dataset.coordinates
            .split(',')
            .map((stringNumber) => Number(stringNumber))
        );
      };
    });
  }

  const newGame = async function thatCreatesNewGame(players) {
    // Empty current turns and add new players to it
    turns.length = 0;
    turns.push(...players);

    // Loop through players to fill boards with ships
    for (const player of turns) {
      PubSub.publish('boardChanged', player.gameboard.board);
      const shipLengths = [5, 4, 3, 3, 2];

      // Keep placing ships until there are 5
      while (player.gameboard.ships < 5) {
        let move;
        if (player.type === 'real') {
          announce(
            `${player.name}, where do you want to place the ship of length ${shipLengths[player.gameboard.ships]}`
          );
          move = await getShipPlacementClick();
        } else {
          // Else the player is a computer, so randomly choose their placement
          move = {
            startingPoint: [
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10),
            ],
            direction: Math.random() < 0.5 ? 'horizontal' : 'vertical',
          };
        }

        // Try placing the ship, prepare to catch errors
        try {
          player.gameboard.placeShip(
            shipLengths[player.gameboard.ships],
            move.startingPoint,
            move.direction
          );

          // Only if player is a real person, show the new rendered board
          if (player.type === 'real') {
            PubSub.publish('boardChanged', player.gameboard.board);
          }
        } catch (error) {
          if (player.type === 'real') announce(error.message);
        }
      }
    }

    playGame();
  };

  const playGame = async function thatControlsFlowOfTheGame() {
    let turnPlayer = turns.shift();

    // Loop turns until the game is over
    while (!turnPlayer.gameboard.isGameOver()) {
      PubSub.publish('boardChanged', turnPlayer.gameboard.guessingBoard);

      let move;
      if (turnPlayer.type === 'real') {
        announce(`${turnPlayer.name}, which spot do you want to attack?`);
        move = await getPlayerGuess();
      } else {
        announce('Computer is playing...');

        // Create a fake wait to make the game more enjoyable
        await new Promise((resolve) => setTimeout(resolve, 1000));
        move = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
      }

      // If the move hasn't already been made, make it
      if (turnPlayer.gameboard.guessingBoard[move[0]][move[1]] === undefined) {
        // The first element of the turns array now is the player whose ship we're attacking
        turnPlayer.gameboard.guessingBoard[move[0]][move[1]] =
          turns[0].gameboard.receiveAttack(move);

        // Add the delay once more
        PubSub.publish('boardChanged', turnPlayer.gameboard.guessingBoard);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Add turn player to the queue again
        turns.push(turnPlayer);
        turnPlayer = turns.shift();
      }
    }

    announce(`The winner is ${turns[0].name}. Congrats!`);
  };

  return { newGame };
})();

export default Game;
