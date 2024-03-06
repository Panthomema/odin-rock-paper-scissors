import { Utils } from "../utils.js";

export class PlayPage
{
  constructor(computerAreaElements, playerAreaElements) {
    this.htmlElement = Utils.createElement(
      'div', 'play-page', 'hidden'
    );

    this.computerArea = Utils.createElement('div', 'computer-area');
    this.playerArea = Utils.createElement('div', 'player-area');

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
      Utils.appendElements(parent, ...elements);
    });
  }
}