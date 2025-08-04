import displayController from './displayController.js';
import Game from './Game.js';
import Player from './Player.js';
import PubSub from './PubSub.js';

// Opens the modal for starting a new game
const newGameBtn = document.querySelector('.create-new-game-btn');
newGameBtn.addEventListener('click', () => {
  const newGameModal = document.querySelector('.new-game-modal');
  newGameModal.showModal();

  // Introduces close button for new game modal
  const closeBtn = document.querySelector('.modal-close-btn');
  closeBtn.addEventListener('click', () => {
    newGameModal.close();
  });

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

    // If player one type hasn't been chosen, display the error message
    if (!playerOneType.validity.valid) {
      playerOneType.setCustomValidity(
        'You must choose a player type for the first player.'
      );
      playerOneType.reportValidity();
    } else {
      newGameModal.close();
      newGameForm.reset();

      // Create both players and start their game
      const playerOne = new Player(playerOneType.value);
      const playerTwo = new Player(playerTwoType.value);
      Game.newGame([playerOne, playerTwo]);
    }
  };
});

// When the board is changed, re-render it
PubSub.subscribe('boardChanged', displayController.render);
