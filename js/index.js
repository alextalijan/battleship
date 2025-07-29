import newGame from './newGame.js';

const newGameBtn = document.querySelector('.create-new-game-btn');
newGameBtn.addEventListener('click', () => {
  newGame();
});
