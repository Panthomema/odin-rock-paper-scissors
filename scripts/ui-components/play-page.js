import { Utils } from "../utils.js";

export class PlayPage
{
  constructor(computerAreaElements, playerAreaElements) {
    this.htmlElement = Utils.createElement(
      'div', 'play-page', 'hidden'
    );

    this.computerArea = Utils.createElement('div', 'computer-area');
    this.playerArea = Utils.createElement('div', 'player-area');
    
    // Creates a Map that contains: [parent, [elemsToAppend]]
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

    // Executes append function for previously created pairs
    pairsToAppend.entries().forEach(([parent, elements]) => {
      Utils.appendElements(parent, ...elements);
    });
  }

  remove() {
    if (!this.htmlElement.parentNode) return;
    this.htmlElement.classList.add('hidden');
    this.htmlElement.remove();
  }
}