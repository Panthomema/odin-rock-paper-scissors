import { UIHelper } from "./ui-helper.js";

export class LoadingOverlay 
{
  constructor() {
    this.htmlElement = UIHelper.createElement('div', 'loading-overlay');
    this.loadingSpinner = UIHelper.createLottieAnimation(
      'https://lottie.host/8588aecb-1b4b-48e1-a569-e63734975c1e/gA4wf2wLSp.json'
    );
    this.checkedIcon = UIHelper.createFAsIcon('fas', 'fa-check');
  }

  clear() {
    if (this.htmlElement.firstElementChild) {
      this.htmlElement.removeChild(this.htmlElement.firstElementChild);
    }
  }

  appendLoadingSpinner() {
    this.htmlElement.appendChild(this.loadingSpinner);
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