import { Utils } from "../utils.js";

export class GameControls 
{
  static ICON_URLS = new Map([
    ['rock', 'https://img.icons8.com/3d-fluency/200/coal.png'],
    ['paper', 'https://img.icons8.com/3d-fluency/200/scroll.png'],
    ['scissors', 'https://img.icons8.com/3d-fluency/200/cut.png']
  ]);

  static createIconMap = ([name, url]) => {
    return [name, Utils.createSVGIcon(url, 'game-icon')];
  }

  constructor(loadingOverlay = null) {
    this.htmlElement = Utils.createElement(
      'div', undefined, 'game-controls'
    );

    this.iconsMap = new Map(
      Array.from(GameControls.ICON_URLS, GameControls.createIconMap)
    );

    Utils.appendElements(
      this.htmlElement,
      ...this.iconsMap.values(),
      ...((loadingOverlay) ? [loadingOverlay.htmlElement] : [])
    );
  }

  appendOverlay(overlay) {
    this.htmlElement.appendChild(overlay.htmlElement);
  }

  removeOverlay(overlay) {
    this.htmlElement.removeChild(overlay.htmlElement);
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

  attachPlayerSelectionEvents(callbackFn) {
    return new Promise(resolve => {
      const icons = Array.from(this.iconsMap.entries());

      const clickHandler = iconName => {
        callbackFn(iconName);
        resolve(iconName);

        icons
          .filter(([name, _]) => name !== iconName)
          .forEach(([name, _]) => this.updateIconsOpacity(0, name));      
      }

      const removeListeners = () => {
        icons.forEach(([_, icon]) => {
          icon.removeEventListener('click', clickHandler);
        });
      }

      icons.forEach(([name, icon]) => {
        icon.addEventListener('click', () => {
          clickHandler(name);
          removeListeners();
        });
      }) 
    });
  }
}