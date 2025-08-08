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

  // If the user chooses player as type, he gets to select his name
  const radioButtons = [
    ...document.querySelectorAll('input[name="playerOne"]'),
    ...document.querySelectorAll('input[name="playerTwo"]'),
  ];
  radioButtons.forEach((button) => {
    button.addEventListener('change', (event) => {
      let label, nameInput;

      if (event.target.value === 'real') {
        label = document.querySelector(
          `input[name="${event.target.id}"]`
        ).nextElementSibling;

        const nameInput = document.createElement('input');
        nameInput.classList.add(`${event.target.id}NameInput`);
        nameInput.type = 'text';
        nameInput.value = label.innerText;

        // Change the label for the input field
        label.parentNode.replaceChild(nameInput, label);
      } else {
        nameInput =
          event.target.parentNode.previousElementSibling.querySelector(
            'input[type="text"]'
          );

        label = document.createElement('label');
        label.textContent = 'Player';

        nameInput.parentNode.replaceChild(label, nameInput);
      }
    });
  });

  const newGameForm = document.querySelector('.new-game-form');
  newGameForm.onsubmit = (event) => {
    event.preventDefault();

    // TODO: add support for capturing player name
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
      const playerOneName = document.querySelector('.playerOneNameInput');
      const playerTwoName = document.querySelector('.playerTwoNameInput');

      newGameModal.close();
      newGameForm.reset();

      // Create both players and start their game
      let playerOne, playerTwo;
      if (playerOneName) {
        playerOne = new Player(playerOneType.value, playerOneName.value);
      } else {
        playerOne = new Player(playerOneType.value);
      }

      if (playerTwoName) {
        playerTwo = new Player(playerTwoType.value, playerTwoName.value);
      } else {
        playerOne = new Player(playerTwoType.value);
      }

      Game.newGame([playerOne, playerTwo]);
    }
  };
});

// When the board is changed, re-render it
PubSub.subscribe('boardChanged', displayController.render);
