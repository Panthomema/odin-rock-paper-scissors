import { GameHandler } from "./game-handler.js";

document.addEventListener('DOMContentLoaded', () => {
  
  const startGameButton = document.querySelector('#start-game');

  startGameButton.addEventListener('click', () => {
    const gameHandler = new GameHandler();
    gameHandler.uiHandler.removeWelcome();
    gameHandler.newGame(); 
  });
});