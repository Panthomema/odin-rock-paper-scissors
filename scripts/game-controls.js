import { UIHelper } from "./ui-helper.js";

export class GameControls 
{
  static ICON_URLS = new Map([
    ['rock', 'https://img.icons8.com/3d-fluency/200/coal.png'],
    ['paper', 'https://img.icons8.com/3d-fluency/200/scroll.png'],
    ['scissors', 'https://img.icons8.com/3d-fluency/200/cut.png']
  ]);

  static createIconMap = ([name, url]) => {
    return [name, UIHelper.createSVGIcon(url, 'game-icon')];
  }

  constructor(loadingOverlay = null) {
    this.htmlElement = UIHelper.createElement(
      'div', undefined, 'game-controls'
    );

    this.iconsMap = new Map(
      Array.from(GameControls.ICON_URLS, GameControls.createIconMap)
    );

    UIHelper.appendElements(
      this.htmlElement, 
      ...this.iconsMap.values(), 
      ...((loadingOverlay) ? [loadingOverlay.htmlElement] : [])
    );
  }

  updateIconsOpacity(opacity, ...iconNames) {
    iconNames.forEach(name => {
      this.iconsMap.get(name).classList.toggle('hidden', opacity === 0)
    }); 
  }

  hideAllIcons() {
    this.updateIconsOpacity(0, ...this.iconsMap.keys());
  }

  showAllIcons() {
    this.updateIconsOpacity(1, ...this.iconsMap.keys());
  }

  appendOverlay(overlay) {
    this.htmlElement.appendChild(overlay.htmlElement);
  }

  removeOverlay(overlay) {
    this.htmlElement.removeChild(overlay.htmlElement);
  }
}