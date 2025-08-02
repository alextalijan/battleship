import Ship from './Ship.js';

const displayController = (function thatControlsWhatIsBeingShown() {
  const screen = document.querySelector('.game-screen');

  const render = function thatRendersTheBoard(board) {
    screen.innerHTML = '';

    for (const row of board) {
      for (const spot of row) {
        const block = document.createElement('div');
        let content = '';
        if (spot instanceof Ship) {
          content = '🚢';
        } else if (spot === true) {
          content = '✅';
        } else if (spot === false) {
          content = '❌';
        }

        block.innerText = content;
        screen.appendChild(block);
      }
    }
  };

  return { render };
})();

export default displayController;
