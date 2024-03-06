import { GameHandler } from "./game-handler.js";

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
    const gameHandler = new GameHandler();
    gameHandler.uiHandler.removeWelcome();
    gameHandler.newGame(); 
  });
});