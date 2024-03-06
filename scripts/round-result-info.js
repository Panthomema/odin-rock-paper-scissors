import { UIHelper } from "./ui-helper.js";

export class RoundResultInfo
{
  constructor() {
    this.htmlElement = UIHelper.createElement('h3', 'round-result', 'hidden');
  }

  clear() {
    this.htmlElement.textContent = '';
  }
}