import { Utils } from "../utils.js";

export class Scoreboard 
{
  static COMPUTER_HEADER = `OPPONENT'S SCORE`;
  static PLAYER_HEADER = 'YOUR SCORE';

  constructor(maxPoints, headerContent) {
    this.htmlElement = Utils.createElement('div', undefined, 'scoreboard');
    
    const header = Utils.createElement('h3');
    header.textContent = headerContent

    this.scoreNodes = Utils.createElement('div', undefined, 'score-nodes');

    for (let i = 0; i < maxPoints; i++) {
      const filledScoreNode = Utils.createFAsIcon('far', 'fa-circle');
      this.scoreNodes.appendChild(filledScoreNode);
    }

    this.htmlElement.appendChild(header);
    this.htmlElement.appendChild(this.scoreNodes);
  }
}