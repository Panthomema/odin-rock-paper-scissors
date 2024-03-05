import { UIHelper } from "./ui-helper.js";

export class UIHandler {
  constructor() {
    
  }

  removeWelcome() {
    const startGameButton = document.querySelector('#start-game');
    const quote = document.querySelector('#quote');
    const rpsTitle = document.querySelector('#rps-title');
    const copyright = document.querySelector('#copyright');

    UIHelper.addClassToElements(
      'hidden',
      startGameButton, 
      quote, 
      rpsTitle, 
      copyright
    );
    setTimeout(() => {
      UIHelper.removeElements(startGameButton, quote, rpsTitle, copyright)
    }, 500);
  }
}