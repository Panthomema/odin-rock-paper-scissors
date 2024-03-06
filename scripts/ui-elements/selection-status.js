import { Utils } from "../utils.js";

export class SelectionStatus
{
  static COMPUTER_WAITING_TEXT = 'Waiting for opponent';
  static PLAYER_WAITING_TEXT = 'Take yor pick';
  static COMPUTER_SELECTED_TEXT = 'Opponent made a pick';
  static PLAYER_SELECTED_TEXT = 'You made a pick';

  constructor() {
    this.htmlElement = Utils.createElement(
      'div', undefined, 'selection-status'
    );
  }

  setContent(content) {
    this.htmlElement.textContent = content;
  }
}