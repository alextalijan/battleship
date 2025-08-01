import Player from './Player.js';
import Game from './Game.js';

const newGame = function thatCreatesANewGame() {
  const newGameModal = document.querySelector('.new-game-modal');
  newGameModal.showModal();

  const newGameForm = document.querySelector('.new-game-form');
  newGameForm.onsubmit = (event) => {
    event.preventDefault();

    // Query the first player type if checked, otherwise capture the first one for validation message
    let playerOneType =
      document.querySelector('input[name="playerOne"]:checked') ||
      document.querySelector('#playerOne');
    playerOneType.setCustomValidity('');

    const playerTwoType = document.querySelector(
      'input[name="playerTwo"]:checked'
    );

    if (!playerOneType.validity.valid) {
      playerOneType.setCustomValidity(
        'You must choose a player type for the first player.'
      );
      playerOneType.reportValidity();
    } else {
      newGameModal.close();
      newGameForm.reset();
      newGameForm.removeAttribute('onsubmit');

      // Create both players and start their game
      const playerOne = new Player(playerOneType.value);
      const playerTwo = new Player(playerTwoType.value || 'computer');
      Game([playerOne, playerTwo]);
    }
  };
};

export default newGame;
