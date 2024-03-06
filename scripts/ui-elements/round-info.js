import { Utils } from "../utils.js";

export class RoundInfo {
  constructor() {
    this.htmlElement = Utils.createElement('h2', 'round-info', 'hidden');
  }

  update(roundNum) {
    this.htmlElement.textContent = `Round ${roundNum}`;
  }
}