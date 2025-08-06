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

        // Add relevant content to the block, as well as coordinates
        block.innerText = content;
        block.dataset.coordinates = `${board.indexOf(row)},${row.indexOf(spot)}`;
        screen.appendChild(block);
      }
    }
  };

  return { render };
})();

export default displayController;
