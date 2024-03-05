import { Game } from "./game.js";

document.addEventListener('DOMContentLoaded', () => {
  
  const startGameButton = document.querySelector('#start-game');

  // Adds some basic click animation
  startGameButton.addEventListener('mousedown', () => {
    startGameButton.classList.add('clicked');
  });
  startGameButton.addEventListener('mouseup', () => {
    startGameButton.classList.remove('clicked');
  });

  // Removes welcome page and starts the game
  startGameButton.addEventListener('click', () => {
    const game = new Game();
    game.uiHandler.removeWelcome();
    game.newGame(); 
  });
});