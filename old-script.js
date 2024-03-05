class Game {
  #round;
  #playerScore;
  #computerScore;
  #playerSelection = null;
  #computerSelection = null;
  static SHOW_RESULT_DELAY = 2000;
  static COMP_MAX_DELAY = 6000;
  static POINTS_WIN = 5;

  constructor() {
    this.GAME_OPTIONS = ['rock', 'paper', 'scissors'];
    this.gameUI = new GameUI();
  }

  async newGame() {
    this.#round = 1;
    this.#playerScore = 0;
    this.#computerScore = 0;
    this.gameUI.renderGame();

    let roundWinner;

    while (true) {
      this.newRound();
      roundWinner = await this.resolveRound();
      this.updateScoreValues(roundWinner);

      if (this.#playerScore >= Game.POINTS_WIN) {
        this.finishGame('player');
        return;
      }

      if (this.#computerScore >= Game.POINTS_WIN) {
        this.finishGame('computer');
        return;
      }
    }
  }

  newRound() {
    this.gameUI.renderNewRound(this.#round);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  } 

  async getComputerSelection() {
    const randomDelay = Math.floor(Math.random() * Game.COMP_MAX_DELAY) + 1000;
    await this.delay(randomDelay);

    return this.generateComputerChoice();
  }

  generateComputerChoice() {
    this.gameUI.showComputerHasSelected('computer');
    return this.GAME_OPTIONS[Math.floor(Math.random() * 3)];
  }

  async playRound() {
    return Promise.all([
      this.getComputerSelection(),
      this.gameUI.getPlayerSelection(),
    ]);
  }

  async resolveRound() {
    [this.#computerSelection, this.#playerSelection] = await this.playRound();

    const roundWinner = this.determineWinner();
    this.gameUI.showRoundResult(this.#computerSelection, roundWinner);
    await this.delay(Game.SHOW_RESULT_DELAY);
    
    return roundWinner;
  }

  determineWinner() {
    const outcomes = {
      rock: { scissors: 'player', paper: 'computer' },
      paper: { rock: 'player', scissors: 'computer' },
      scissors: { paper: 'player', rock: 'computer' }
    };

    const result = outcomes[this.#playerSelection][this.#computerSelection];

    return result || null;
  }

  updateScoreValues(roundWinner) {
    this.#round++;
    this.#playerSelection = null;
    this.#computerSelection = null;

    if (roundWinner === 'player') this.#playerScore++;
    if (roundWinner === 'computer') this.#computerScore++;
  }

  finishGame(gameWinner) {
    this.gameUI.showGameResult(
      gameWinner,
      this.#playerScore, 
      this.#computerScore
    );

    this.gameUI.setRestartButton(this.restartGame.bind(this));
  }

  restartGame() {
    this.gameUI.removeModal();
    this.gameUI.refreshGameUI();
    this.gameUI = new GameUI();
    this.newGame();
  }
}

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

  addClassToElements(className, ...elements) {
    elements.forEach(element => element.classList.add(className));
  }

  appendElements(parent, ...elements) {
    elements.forEach(element => parent.appendChild(element));
  }

  removeElements(...elements) {
    elements.forEach(element => element.remove());
  }

  createElement(tag, id, ...classNames) {
    const element = document.createElement(tag);
    if (id) element.setAttribute('id', id);
    classNames.forEach(name => element.classList.add(name));

    return element;
  }

  appendWithDelay(element, parent, appendDelay, showDelay, animationFn = null) {
    setTimeout(() => { 
      parent.appendChild(element);
      if (animationFn) animationFn(element);
    }, appendDelay);

    setTimeout(() => {
      element.classList.add('game-append') 
    }, showDelay);
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

  createSVGIcon(url, ...classNames) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    classNames.forEach(name => svg.classList.add(name));
    
    const image = document.createElementNS(
      "http://www.w3.org/2000/svg",
       "image"
    );
    image.setAttribute('href', url);
    
    svg.appendChild(image);

    return svg;
  }

  createFAsIcon(prefix, iconName) {
    const checkedIcon = document.createElement('i');
    checkedIcon.classList.add(prefix, iconName);
    
    return checkedIcon;
  }

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

  removeWelcome() {
    const startGameButton = document.querySelector('#start-game');
    const quote = document.querySelector('#quote');
    const rpsTitle = document.querySelector('#rps-title');
    const copyright = document.querySelector('#copyright');

    this.addClassToElements(
      'hidden',
      startGameButton, 
      quote, 
      rpsTitle, 
      copyright
    );
    setTimeout(() => {
      this.removeElements(startGameButton, quote, rpsTitle, copyright)
    }, 500);
  }

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

  createScoreboard(player) {
    const scoreboard = this.createElement('div', undefined, 'scoreboard');

    const title = this.createElement('h3');
    let scoreNodes;

    if (player === 'player') {
      title.textContent = 'PLAYER SCORE';
      this.playerScore = this.createScoreNodes();
      scoreNodes = this.playerScore;
    } else {
      title.textContent = 'OPPONENT\'S SCORE';
      this.computerScore = this.createScoreNodes();
      scoreNodes = this.computerScore;
    }

    scoreboard.appendChild(title);
    scoreboard.appendChild(scoreNodes);

    return scoreboard;
  }
  
  createScoreNodes() {
    const score = this.createElement('div', undefined, 'score-nodes');

    for (let i = 0; i < GameUI.SCORE_NODES; i++) {
      const filledScoreNode = this.createFAsIcon('far', 'fa-circle');
      score.appendChild(filledScoreNode);
    }

    return score;
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

  updateRoundInfo(roundNum) {
    this.roundInfo.textContent = `Round ${roundNum}`;
  }

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

document.addEventListener('DOMContentLoaded', () => {
  
  const startGameButton = document.querySelector('#start-game');

  // Adds some basic click animation
  startGameButton.addEventListener('mousedown', () => {
    startGameButton.classList.add('clicked');
  });
  startGameButton.addEventListener('mouseup', () => {
    startGameButton.classList.remove('clicked');
  });

  // Removes welcome page and starts the game
  startGameButton.addEventListener('click', () => {
    const game = new Game();
    game.gameUI.removeWelcome();
    game.newGame(); 
  });
});


