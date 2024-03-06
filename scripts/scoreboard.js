import { UIHelper } from "./ui-helper.js";

export class Scoreboard 
{
  static COMPUTER_HEADER = `OPPONENT'S SCORE`;
  static PLAYER_HEADER = 'YOUR SCORE';
  
  constructor(maxPoints, headerContent) {
    this.htmlElement = UIHelper.createElement('div', undefined, 'scoreboard');
    
    const header = UIHelper.createElement('h3');
    header.textContent = headerContent

    this.scoreNodes = UIHelper.createElement('div', undefined, 'score-nodes');

    for (let i = 0; i < maxPoints; i++) {
      const filledScoreNode = UIHelper.createFAsIcon('far', 'fa-circle');
      this.scoreNodes.appendChild(filledScoreNode);
    }

    this.htmlElement.appendChild(header);
    this.htmlElement.appendChild(this.scoreNodes);
  }
}