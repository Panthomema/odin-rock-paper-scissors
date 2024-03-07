import { Utils } from "../utils.js";

export class LoadingOverlay 
{
  static APPEND_CHECK_DELAY = 300;
  static SHOW_CHECK_DELAY = 600;
  static APPEND_LOADING_DELAY = 300;
  static SHOW_LOADING_DELAY = 600;

  constructor() {
    this.htmlElement = Utils.createElement('div', 'loading-overlay');
    this.checkedIcon = Utils.createFAsIcon('fas', 'fa-check');
  }

  clear() {
    // Removes only elements (ignoring text nodes, for example)
    if (this.htmlElement.firstElementChild) {
      this.htmlElement.removeChild(this.htmlElement.firstElementChild);
    }
  }

  appendLoadingSpinner() {
    // Lottie animation needs to be initialized every time u append it again
    this.loadingSpinner = Utils.createLottieAnimation(
      'https://lottie.host/8588aecb-1b4b-48e1-a569-e63734975c1e/gA4wf2wLSp.json'
    );

    Utils.appendWithDelay(
      this.htmlElement,
      this.loadingSpinner,
      'append-loading-transition',
      LoadingOverlay.APPEND_LOADING_DELAY,
      LoadingOverlay.SHOW_LOADING_DELAY
    );
  }

  appendCheckedIcon() {
    Utils.appendWithDelay(
      this.htmlElement,
      this.checkedIcon,
      'append-check-transition',
      LoadingOverlay.APPEND_CHECK_DELAY,
      LoadingOverlay.SHOW_CHECK_DELAY,
      Utils.growElement
    );
  }
}
