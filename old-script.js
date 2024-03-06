class GameUI {
  static APPEND_GAME_DELAY = 500;
  static SHOW_GAME_DELAY = 1000;
  static APPEND_CHECK_DELAY = 300;
  static SHOW_CHECK_DELAY = 600;
  static APPEND_RESULT_DELAY = 200;
  static SHOW_RESULT_DELAY = 400;
  static APPEND_MODAL_DELAY = 400;
  static SHOW_MODAL_DELAY = 800;
  static SCORE_NODES = 5;

  constructor() {
    this.header = document.querySelector('header');
    this.main = document.querySelector('main');
    this.footer = document.querySelector('footer');
    this.wrapper = document.querySelector('#wrapper');
  }

  // General purpose functions

  removeAllChilds(parentElement) {
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
  }

  // Specific animations

  growElement(element) {
    element.animate([
        { transform: 'scale(0)' },
        { transform: 'scale(1)' }
    ], {
        duration: 200,
        easing: 'ease-in-out'
    });
  }

  // Loading key resources

  loadResources() {
    const iconURLs = new Map();
    iconURLs.set('rock', 'https://img.icons8.com/3d-fluency/200/coal.png');
    iconURLs.set('paper', 'https://img.icons8.com/3d-fluency/200/scroll.png');
    iconURLs.set('scissors', 'https://img.icons8.com/3d-fluency/200/cut.png');
    
    const createIconMap = ([name, url]) => {
      return [name, this.createSVGIcon(url, 'game-icon')];
    }

    this.computerIcons = new Map(Array.from(iconURLs, createIconMap));
    this.playerIcons = new Map(Array.from(iconURLs, createIconMap));

    this.loadingWheel = this.createLottieAnimation(
      'https://lottie.host/8588aecb-1b4b-48e1-a569-e63734975c1e/gA4wf2wLSp.json'
    );
    this.checkedIcon = this.createFAsIcon('fas', 'fa-check');
  }

  // UI renderization

  renderGame() {
    this.loadResources();
    this.renderHeader();
    this.renderMain();
    this.footer.style.setProperty('align-items', 'center');
  }

  renderHeader() {
    this.roundInfo = this.createElement('h2', 'round-info', 'hidden');
    this.appendWithDelay(
      this.roundInfo,
      this.header,
      GameUI.APPEND_GAME_DELAY,
      GameUI.SHOW_GAME_DELAY
    );
  }

  renderMain() {
    this.main = document.querySelector('main');
    const playPage = this.createElement('div', 'play-page', 'hidden');

    const computerArea = this.createArea('computer');
    const playerArea = this.createArea('player');

    playPage.appendChild(computerArea);
    playPage.appendChild(playerArea);

    this.appendWithDelay(
      playPage, 
      this.main,
      GameUI.APPEND_GAME_DELAY,
      GameUI.SHOW_GAME_DELAY
    );
  }

  // UI Elements creation

  createArea(player) {
    const area = document.createElement('div');
    area.setAttribute('id', `${player}-area`);
    area.appendChild(this.createScoreboard(player));
    area.appendChild(this.createGameControls(player));
    area.appendChild(this.createSelectionStatus(player));

    return area;
  }

  createGameControls(player) {
    const controls = this.createElement('div', undefined, 'game-controls');
    let icons;

    if (player === 'player') {
      icons = Array.from(this.playerIcons.values());
    } else {
      icons = Array.from(this.computerIcons.values());
      this.createOpponentOverlay();
      controls.appendChild(this.loadingOverlay);
    }

    icons.forEach(icon => {
      controls.appendChild(icon);
    });

    return controls;
  }

  createOpponentOverlay() {
    this.loadingOverlay = this.createElement('div', 'loading-overlay');
  }

  createSelectionStatus(player) {
    const statusMessage = this.createElement(
      'div', 
      undefined, 
      'selection-status'
    );
    if (player === 'player') {
      this.playerStatusMessage = statusMessage;
    } else {
      this.computerStatusMessage = statusMessage;
    }
    
    return statusMessage;
  }

  createEndGameModal() {
    this.endGameModal = this.createElement('div', 'end-modal');
    this.winnerInfo = this.createElement('h2', 'winner-info');
    this.result = this.createElement('h1', 'final-score');
    this.restartButton = this.createElement('button', 'restart-btn');
    this.restartButton.textContent = 'Play Again';
  }


  // UI elements modification

  updateScoreNodes(player) {
    const scoreNodes = (player === 'player') 
                          ? this.playerScore 
                          : this.computerScore; 

    const nextPoint = scoreNodes.querySelector('.far');

    if (nextPoint) {
      nextPoint.classList.replace('far', 'fas');
    }
  }

  updateGameIconsOpacity(player, opacity, ...iconNames) {
    const icons = (player === 'player') ? this.playerIcons : this.computerIcons;
    iconNames.forEach(name => {
      icons.get(name).classList.toggle('hidden', opacity === 0)
    }); 
  }

  updateOpponentOverlay(isSelected = false) {
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

  updateSelectionStatus(player, isSelected = false) {
    if (player === 'player') {
      this.playerStatusMessage.textContent = (isSelected)
                                              ? 'You made a pick'
                                              : 'Take your pick'; 
    } else {
      this.computerStatusMessage.textContent = (isSelected)
                                                ? 'Opponent made a pick'
                                                : 'Waiting for opponent';
    }
  }

  updateRoundResultText(roundWinner) {
    if (roundWinner === undefined) {
      if (this.footer.firstElementChild) {
        this.footer.removeChild(this.footer.firstElementChild);
      }
      return;
    }

    const roundResultText = this.createElement('h3', 'round-result');
    switch (roundWinner) {
      case 'player':
        roundResultText.textContent = 'YOU WIN!';
        break;
      
      case 'computer':
        roundResultText.textContent = 'YOU LOSE!';
        break;

      default:
        roundResultText.textContent = 'TIE!';
        break;
    }

    this.appendWithDelay(
      roundResultText, 
      this.footer,
      GameUI.APPEND_RESULT_DELAY,
      GameUI.SHOW_RESULT_DELAY
    );
  }

  updateEndGameModal(winner, playerScore, computerScore) {   
    this.winnerInfo.textContent = (winner === 'player')
                              ? 'YOU WIN!'
                              : 'YOU LOSE!';
    
    this.result.textContent = `${playerScore} - ${computerScore}`; 
  }


  // Game flux control

  renderNewRound(roundNum) {
    this.updateRoundInfo(roundNum);
    this.restoreGameIcons();
    this.updateOpponentOverlay();
    this.loadingOverlay.style.setProperty('opacity', 1);
    this.updateSelectionStatus('player');
    this.updateSelectionStatus('computer');
    this.updateRoundResultText();
  }

  showComputerHasSelected() { 
    this.updateOpponentOverlay(true);
    this.updateSelectionStatus('computer', true);
  }

  attachPlayerSelectionEvents() {
    return new Promise(resolve => {
      const icons = Array.from(this.playerIcons.entries());

      const clickHandler = name => {
        this.showPlayerHasSelected(name);
        resolve(name);

        // Remove event listeners after the user makes a selection
        icons.forEach(([name, icon]) => {
          icon.removeEventListener('click', clickHandler);
        });
      }

      icons.forEach(([name, icon]) => {
        icon.addEventListener('click', () => clickHandler(name));
      }) 
    });
  }

  async getPlayerSelection() {
    return await this.attachPlayerSelectionEvents();
  }

  showPlayerHasSelected(selection) {
    this.updateSelectionStatus('player', true);
    this.updateGameIconsOpacity(
      'player', 
      0, 
      ...this.playerIcons.keys().filter(icon => icon !== selection)
    );
  }

  showRoundResult(computerSelection, winner) {
    this.loadingOverlay.style.setProperty('opacity', 0);
    this.updateGameIconsOpacity('computer', 1, computerSelection);

    if (winner) {
      this.updateScoreNodes(winner);
    }
    
    this.updateRoundResultText(winner);
  }

  restoreGameIcons() {
    this.updateGameIconsOpacity(
      'computer', 
      0, 
      ...Array.from(this.computerIcons.keys())
    );
    this.updateGameIconsOpacity(
      'player', 
      1, 
      ...Array.from(this.playerIcons.keys())
    );
  }

  showGameResult(winner, playerScore, computerScore) {
    if (!this.endGameModal) this.createEndGameModal();
    this.updateEndGameModal(winner, playerScore, computerScore);

    this.appendElements(
      this.endGameModal, 
      this.winnerInfo, 
      this.result, 
      this.restartButton
    );

    this.appendWithDelay(
      this.endGameModal,
      this.wrapper,
      GameUI.APPEND_MODAL_DELAY,
      GameUI.SHOW_MODAL_DELAY
    );
  }

  setRestartButton(restartFn) {
    this.restartButton.addEventListener('click', () => restartFn());
  }

  removeModal() {
    this.endGameModal.remove();
  }

  refreshGameUI() {
    [this.header, this.main, this.footer].forEach(elem => {
      this.removeAllChilds(elem);
    });
  }
}


