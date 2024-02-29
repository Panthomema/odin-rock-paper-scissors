class LottieTest {
  createOpponentOverlay() {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.setAttribute('id', 'overlay');
  }

  loadResources() {
    this.loadingWheel = this.createLottieAnimation(
      'https://lottie.host/8588aecb-1b4b-48e1-a569-e63734975c1e/gA4wf2wLSp.json'
    );
    this.checkedIcon = this.createFAsIcon('fas', 'fa-check');
  }

  updateOpponentOverlay(isSelected = false) {
    if (isSelected) this.loadingWheel.stop();

    if (this.loadingOverlay.firstChild) {
      this.loadingOverlay.removeChild(this.loadingOverlay.firstChild);
    }

    this.loadingOverlay.appendChild(
      (isSelected) ? this.checkedIcon : this.loadingWheel
    );
    if (!isSelected) this.loadingWheel.play();
  }

  createLottieAnimation(url) {
    const lottiePlayer = document.createElement('lottie-player');
    const properties = {
      'src': url,
      'autoplay': '',
      'loop': '',
      'mode': 'normal',
    };

    Object.entries(properties).forEach(([attribute, value]) => {
      lottiePlayer.setAttribute(attribute, value);
    });

    return lottiePlayer;
  }

  createFAsIcon(prefix, iconName) {
    const checkedIcon = document.createElement('i');
    checkedIcon.classList.add(prefix, iconName);
    
    return checkedIcon;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  } 

  async execute() {
    this.loadResources();
    const body = document.querySelector('body');
    this.createOpponentOverlay();
    body.appendChild(this.loadingOverlay);
    this.updateOpponentOverlay();
    await this.delay(5000);
    console.log(this.loadingWheel.getLottie());
    this.loadingWheel.pause();

    /*
    await this.delay(5000);
    this.updateOpponentOverlay(true);
    await this.delay(5000);
    this.updateOpponentOverlay();
    */
  }
}

const test = new LottieTest();

document.addEventListener('DOMContentLoaded', () => {
  

  test.execute();
});