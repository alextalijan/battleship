import Ship from './Ship.js';

const displayController = (function thatControlsWhatIsBeingShown() {
  const screen = document.querySelector('.game-screen');

  const render = function thatRendersTheBoard(board) {
    screen.innerHTML = '';

    for (const row of board) {
      for (let i = 0; i < row.length; i += 1) {
        const block = document.createElement('div');
        let content = '';
        if (row[i] instanceof Ship) {
          if (row[i].isSunk) {
            content = '✅';
          } else {
            content = '🚢';
          }
        } else if (row[i] === false) {
          content = '❌';
        }

        // Add relevant content to the block, as well as coordinates
        block.innerText = content;
        block.dataset.coordinates = `${board.indexOf(row)},${i}`;
        screen.appendChild(block);
      }
    }
  };

  return { render };
})();

export default displayController;
