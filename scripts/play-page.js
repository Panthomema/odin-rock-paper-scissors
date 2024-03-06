import { UIHelper } from "./ui-helper.js";

export class PlayPage
{
  constructor(computerAreaElements, playerAreaElements) {
    this.htmlElement = UIHelper.createElement('div', 'play-page', 'hidden');
    this.computerArea = UIHelper.createElement('div', 'computer-area');
    this.playerArea = UIHelper.createElement('div', 'player-area');

    const pairsToAppend = new Map([
      [
        this.computerArea, 
        computerAreaElements.values().map(obj => obj.htmlElement)
      ],
      [
        this.playerArea, 
        playerAreaElements.values().map(obj => obj.htmlElement)
      ],
      [
        this.htmlElement, [this.computerArea, this.playerArea]
      ]
    ]);

    pairsToAppend.entries().forEach(([parent, elements]) => {
      UIHelper.appendElements(parent, ...elements);
    });
  }
}