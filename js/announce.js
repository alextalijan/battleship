const announce = function thatShowsTextOnScreen(text) {
  const announcer = document.querySelector('.game-announcer');
  announcer.innerText = text;
};

export default announce;
