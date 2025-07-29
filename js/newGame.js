import Player from './Player.js';
import Game from './Game.js';

const newGame = function thatCreatesANewGame() {
  const newGameModal = document.querySelector('.new-game-modal');
  newGameModal.showModal();

  const startGameBtn = document.querySelector('.start-game-btn');
  startGameBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const playerOneType = document.querySelector(
      'input[name="playerOne"]:checked'
    );
    const playerTwoType = document.querySelector(
      'input[name="playerTwo"]:checked'
    );

    if (!playerOneType || !playerTwoType) {
      alert('Please choose player types for both players.');
    } else {
      newGameModal.close();

      // Create both players and start their game
      const playerOne = new Player(playerOneType.value);
      const playerTwo = new Player(playerTwoType.value);
      Game([playerOne, playerTwo]);
    }
  });
};

export default newGame;
