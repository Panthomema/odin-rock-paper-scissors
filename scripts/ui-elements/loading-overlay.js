import { Utils } from "../utils.js";

export class LoadingOverlay 
{
  static APPEND_CHECK_DELAY = 300;
  static SHOW_CHECK_DELAY = 600;

  constructor() {
    this.htmlElement = Utils.createElement('div', 'loading-overlay');
    this.checkedIcon = Utils.createFAsIcon('fas', 'fa-check');
  }

  clear() {
    if (this.htmlElement.firstElementChild) {
      this.htmlElement.removeChild(this.htmlElement.firstElementChild);
    }
  }

  appendLoadingSpinner() {
    // Lottie animation needs to be initialized every time u append it again
    this.loadingSpinner = Utils.createLottieAnimation(
      'https://lottie.host/8588aecb-1b4b-48e1-a569-e63734975c1e/gA4wf2wLSp.json'
    );

    this.htmlElement.appendChild(this.loadingSpinner);
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

function updateOpponentOverlay(isSelected = false) {
  if (this.loadingOverlay.firstElementChild) {
    this.loadingOverlay.removeChild(this.loadingOverlay.firstElementChild);
  }

  if (isSelected) {
    this.appendWithDelay(
      this.checkedIcon, 
      this.loadingOverlay,
      GameUI.APPEND_CHECK_DELAY,
      GameUI.SHOW_CHECK_DELAY,
      this.growElement.bind(this)
    );
  } else {
    this.loadingWheel = this.createLottieAnimation(
      'https://lottie.host/8588aecb-1b4b-48e1-a569-e63734975c1e/gA4wf2wLSp.json'
    );

    this.loadingOverlay.appendChild(this.loadingWheel);
  }
}