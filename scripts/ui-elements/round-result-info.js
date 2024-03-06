import { Utils } from "../utils.js";

export class RoundResultInfo
{
  constructor() {
    this.htmlElement = Utils.createElement('h3', 'round-result', 'hidden');
  }

  clear() {
    this.htmlElement.textContent = '';
  }
}