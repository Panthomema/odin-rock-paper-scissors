import { Utils } from "../utils.js";

export class RoundResultInfo
{
  static APPEND_DELAY = 200;
  static SHOW_DELAY = 400;
  static VICTORY_TXT = 'YOU WIN!';
  static DEFEAT_TXT = 'YOU LOSE!';
  static TIE_TXT = 'TIE!';

  constructor() {
    this.htmlElement = Utils.createElement('h3', 'round-result', 'hidden');
  }

  remove() {
    if(!this.htmlElement.parentNode) return;
    this.htmlElement.classList.add('hidden');
    this.htmlElement.remove();
  }

  showResultMessage(parentElement, winner) {
    switch (winner) {
      case 'player':
        this.htmlElement.textContent = RoundResultInfo.VICTORY_TXT;
        break;
      
      case 'computer':
        this.htmlElement.textContent = RoundResultInfo.DEFEAT_TXT;
        break;

      default:
        this.htmlElement.textContent = RoundResultInfo.TIE_TXT;
        break;
    }

    Utils.appendWithDelay(
      parentElement, 
      this.htmlElement,
      'append-result-transition',
      RoundResultInfo.APPEND_DELAY,
      RoundResultInfo.SHOW_DELAY
    );
  } 
}