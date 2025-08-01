import newGame from './newGame.js';

const newGameBtn = document.querySelector('.create-new-game-btn');
newGameBtn.addEventListener('click', () => {
  newGame();
});

// Initializes close button for new game modal
const modal = document.querySelector('.new-game-modal');
const closeBtn = document.querySelector('.modal-close-btn');
closeBtn.addEventListener('click', () => {
  modal.close();
});
