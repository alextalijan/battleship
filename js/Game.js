import announce from './announce.js';
import playRound from './playRound.js';
import PubSub from './PubSub.js';

const Game = (function thatControlsGameplay() {
  const turns = [];

  function __getShipPlacementClick__(boardElement) {
    return new Promise((resolve) => {
      boardElement.addEventListener(
        'click',
        (event) => {
          event.stopPropagation();

          const direction = prompt(
            'How do you want to place the ship? horizontal / vertical'
          );

          resolve({
            startingPoint: event.target.dataset.coordinates
              .split(',')
              .map((stringNumber) => Number(stringNumber)),
            direction,
          });
        },
        { once: true }
      );
    });
  }

  const newGame = async function thatCreatesNewGame(players) {
    // Empty current turns and add new players to it
    turns.length = 0;
    turns.push(...players);

    // Loop through players to fill boards with ships
    for (const player of turns) {
      const shipLengths = [5, 4, 3, 3, 2];

      // Keep placing ships until there are 5
      const boardScreen = document.querySelector('.game-screen');
      while (player.gameboard.ships < 5) {
        let move;
        if (player.type === 'real') {
          move = await __getShipPlacementClick__(boardScreen);
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
        } catch (error) {
          if (player.type === 'real') announce(error.message);
        }
      }
    }
  };

  return { players, newGame };
})();

const Game = function thatRepresentsTheWholeGame(players) {
  window.playersQueue = players;

  // // Loop through all players to fill boards with ships
  // for (const player of window.playersQueue) {
  //   const shipLengths = [5, 4, 3, 3, 2];

  //   // Keep placing ships until there are 5
  //   while (player.gameboard.ships < 5) {
  //     if (player.type === 'real') {
  //       let placement = prompt(
  //         `Where to place the ${shipLengths[player.gameboard.ships]} lengthed ship? E.g. 0,5 vertical -> 1st row, 6th column, placed vertically.`
  //       );
  //       placement = placement.split(' ');

  //       try {
  //         const move = {
  //           startingPoint: placement[0]
  //             .split(',')
  //             .map((stringNumber) => Number(stringNumber)),
  //           direction: placement[1],
  //         };
  //         player.gameboard.placeShip(
  //           shipLengths[player.gameboard.ships],
  //           move.startingPoint,
  //           move.direction
  //         );
  //         PubSub.publish('boardChanged', player.gameboard.board);
  //       } catch (error) {
  //         console.log(error.message);
  //       }
  //     } else {
  //       // If player is a computer, randomly generate its ships
  //       let i = 0;
  //       while (i < 5) {
  //         try {
  //           player.gameboard.placeShip(
  //             shipLengths[i],
  //             [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
  //             Math.random() < 0.5 ? 'horizontal' : 'vertical'
  //           );
  //           i += 1;
  //         } catch (error) {
  //           console.log(error.message);
  //         }
  //       }
  //     }
  //   }
  // }

  // Start the game and changing turns
  let turnPlayer = window.playersQueue.shift();
  const screen = document.querySelector('.game-screen');
  if (turnPlayer.type === 'real') {
    announce(
      'Which spot do you want to attack? E.g. 5,5 -> you would attack 6th row, 6th column.'
    );

    screen.addEventListener(
      'click',
      playRound(turnPlayer, event.target.dataset.boardSpot)
    );
  } else {
    // Else the player is computer, so generate guess randomly until it's valid
    while (true) {
      const randomMove = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];

      // If the move hasn't been made, make it
      if (
        ![true, false].includes(
          turnPlayer.gameboard.guessingBoard[randomMove[0]][randomMove[1]]
        )
      ) {
        // Make an attack on the opponents ship
        turnPlayer.gameboard.guessingBoard[randomMove[0]][randomMove[1]] =
          window.playersQueue[0].gameboard.receiveAttack(randomMove);

        turnPlayer = window.playersQueue.shift();
        break;
      }
    }
  }
};

export default Game;
