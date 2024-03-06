import { UIHelper } from "./ui-helper.js";

export class RoundInfo {
  constructor() {
    this.htmlElement = UIHelper.createElement('h2', 'round-info', 'hidden');
  }

  update(roundNum) {
    this.htmlElement.textContent = `Round ${roundNum}`;
  }
}