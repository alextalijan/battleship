import announce from './announce.js';
import PubSub from './PubSub.js';
import Ship from './Ship.js';

const Game = (function thatControlsGameplay() {
  const turns = [];

  function getShipPlacementClick() {
    const boardElement = document.querySelector('.game-screen');

    return new Promise((resolve) => {
      boardElement.onclick = (event) => {
        event.stopPropagation();

        let direction = prompt(
          'How do you want to place the ship? horizontal (h) / vertical (v)'
        );

        // Make sure the input of direction is proper
        if (direction === 'horizontal' || direction === 'h') {
          direction = 'horizontal';
        } else if (direction === 'vertical' || direction === 'v') {
          direction = 'vertical';
        }

        resolve({
          startingPoint: event.target.dataset.coordinates
            .split(',')
            .map((stringNumber) => Number(stringNumber)),
          direction,
        });
      };
    });
  }

  function getPlayerGuess() {
    const boardElement = document.querySelector('.game-screen');

    return new Promise((resolve) => {
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

  function delay(ms, gameToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (gameToken === currentGameToken) {
          resolve();
        }
      }, ms);
    });
  }

  // Keep track of smarter computer moves
  const priorityComputerMoves = [];

  function generateComputerMove() {
    if (priorityComputerMoves.length > 0) {
      return priorityComputerMoves.pop();
    } else {
      return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    }
  }

  // Used for tracking if a move is from a previous game and should be ignored
  let currentGameToken = 0;

  const newGame = async function thatCreatesNewGame(players) {
    // Increase the gameToken by one to announce a new game
    currentGameToken += 1;

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
        // Forget about it if the game has been reset
        const token = currentGameToken;
        await delay(1000, token);
        move = generateComputerMove();
      }

      // If the move hasn't already been made, make it
      if (turnPlayer.gameboard.guessingBoard[move[0]][move[1]] === undefined) {
        // The first element of the turns array now is the player whose ship we're attacking
        turnPlayer.gameboard.guessingBoard[move[0]][move[1]] =
          turns[0].gameboard.receiveAttack(move);

        // If computer made a hit, add adjacent fields to smarterComputerMoves queue
        if (
          turnPlayer.type === 'computer' &&
          turnPlayer.gameboard.guessingBoard[move[0]][move[1]] instanceof Ship
        ) {
          let adjacentMoves;

          // If the direction of the ship has been determined, ignore the priority moves going other direction
          if (
            turnPlayer.gameboard.guessingBoard[move[0] - 1][move[1]] instanceof
              Ship ||
            turnPlayer.gameboard.guessingBoard[move[0] + 1][move[1]] instanceof
              Ship
          ) {
            adjacentMoves = [
              [move[0] - 1, move[1]],
              [move[0] + 1, move[1]],
            ];

            // Clear the priority moves of spots in vertical direction
            for (let i = priorityComputerMoves.length - 1; i >= 0; i -= 1) {
              // If the column of the move is not the same as the last added move, delete it
              if (priorityComputerMoves[i][1] !== adjacentMoves[0][1]) {
                priorityComputerMoves.splice(i, 1);
              }
            }
          } else if (
            turnPlayer.gameboard.guessingBoard[move[0]][move[1] - 1] instanceof
              Ship ||
            turnPlayer.gameboard.guessingBoard[move[0]][move[1] + 1] instanceof
              Ship
          ) {
            adjacentMoves = [
              [move[0], move[1] - 1],
              [move[0], move[1] + 1],
            ];

            // Clear the priority moves of spots in vertical direction
            for (let i = priorityComputerMoves.length - 1; i >= 0; i -= 1) {
              // If the row of the move is not the same as the last added move, delete it
              if (priorityComputerMoves[i][0] !== adjacentMoves[0][0]) {
                priorityComputerMoves.splice(i, 1);
              }
            }
          } else {
            // Add adjacent moves to the queue
            adjacentMoves = [
              [move[0] - 1, move[1]],
              [move[0], move[1] + 1],
              [move[0] + 1, move[1]],
              [move[0], move[1] - 1],
            ];
          }

          // Loop through moves and remove ones that are out of bounds
          for (let i = adjacentMoves.length - 1; i >= 0; i -= 1) {
            if (
              adjacentMoves[i][0] < 0 ||
              adjacentMoves[i][0] > 9 ||
              adjacentMoves[i][1] < 0 ||
              adjacentMoves[i][1] > 9
            ) {
              adjacentMoves.splice(i, 1);
            }
          }

          // Add valid moves to the priority queue
          priorityComputerMoves.push(...adjacentMoves);

          // If the ship has been sunk, clear the queue of priority moves
          if (turnPlayer.gameboard.guessingBoard[move[0]][move[1]].isSunk) {
            priorityComputerMoves.length = 0;
          }
        }

        // Add the delay once more
        PubSub.publish('boardChanged', turnPlayer.gameboard.guessingBoard);
        const token = currentGameToken;
        await delay(2000, token);

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
