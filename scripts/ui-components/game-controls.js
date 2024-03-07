import { Utils } from "../utils.js";

export class GameControls 
{
  static ICON_URLS = new Map([
    ['rock', 'https://img.icons8.com/3d-fluency/200/coal.png'],
    ['paper', 'https://img.icons8.com/3d-fluency/200/scroll.png'],
    ['scissors', 'https://img.icons8.com/3d-fluency/200/cut.png']
  ]);

  // Creates a Map with created SVG elements from the sources given
  static createIconMap = ([name, url]) => {
    return [
      name, 
      Utils.createSVGIcon(url, 'game-icon', 'opacity-icons-transition')
    ];
  }

  constructor(loadingOverlay = null) {
    this.htmlElement = Utils.createElement(
      'div', undefined, 'game-controls'
    );
  
    this.iconsMap = new Map(
      Array.from(GameControls.ICON_URLS, GameControls.createIconMap)
    );

    // Appends loading overlay only in case it is provided
    Utils.appendElements(
      this.htmlElement,
      ...this.iconsMap.values(),
      ...((loadingOverlay) ? [loadingOverlay.htmlElement] : [])
    );
  }

  appendOverlay(overlay) {
    if (this.htmlElement.contains(overlay.htmlElement)) return;
    this.htmlElement.appendChild(overlay.htmlElement);
  }

  removeOverlay(overlay) {
    if (!this.htmlElement.contains(overlay.htmlElement)) return;
    this.htmlElement.removeChild(overlay.htmlElement);
  }

  updateIconsOpacity(opacity, ...iconNames) {
    iconNames.forEach(name => {
      this.iconsMap.get(name).classList.toggle('hidden', opacity === 0);
    });
  }

  hideAllIcons() {
    this.updateIconsOpacity(0, ...this.iconsMap.keys());
  }

  showAllIcons() {
    this.updateIconsOpacity(1, ...this.iconsMap.keys());
  }

}