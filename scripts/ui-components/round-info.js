import { Utils } from "../utils.js";

export class RoundInfo {
  constructor() {
    this.htmlElement = Utils.createElement('h2', 'round-info', 'hidden');
  }

  update(roundNum) {
    this.htmlElement.textContent = `Round ${roundNum}`;
  }

  remove() {
    if (!this.htmlElement.parentNode) return;
    this.htmlElement.classList.add('hidden');
    this.htmlElement.remove();
  }
}