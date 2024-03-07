import { Utils } from "../utils.js";


export class EndGameModal
{
  static VICTORY_TXT = 'VICTORY';
  static DEFEAT_TXT = 'DEFEAT'
  static APPEND_DELAY = 400;
  static SHOW_DELAY = 800;

  constructor() {
    this.htmlElement = Utils.createElement('div', 'end-modal', 'hidden');
    
    this.winnerInfo = Utils.createElement('h2', 'winner-info');
    this.result = Utils.createElement('h1', 'final-score');
    this.restartButton = Utils.createElement('button', 'restart-btn');
    this.restartButton.textContent = 'Play Again';

    Utils.appendElements(
      this.htmlElement, 
      this.winnerInfo, 
      this.result, 
      this.restartButton
    );
  }

  update(winner, computerScore, playerScore) {
    this.winnerInfo.textContent = (winner === 'player') 
      ? EndGameModal.VICTORY_TXT 
      : EndGameModal.DEFEAT_TXT;
    this.result.textContent = `${computerScore} - ${playerScore}`;
  }

  append(parentElement) {
    if (parentElement.htmlElement.contains(this.htmlElement)) return;

    Utils.appendWithDelay(
      parentElement.htmlElement,
      this.htmlElement,
      'append-modal-transition',
      EndGameModal.APPEND_DELAY,
      EndGameModal.SHOW_DELAY
    );
  }

  remove() {
    if (!this.htmlElement.parentNode) return;
    this.htmlElement.classList.add('hidden');
    this.htmlElement.remove();
  }
  
}
