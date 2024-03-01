class Game{
  #round = 1;
  #playerScore = 0;
  #computerScore = 0;
  #playerSelection = null;
  #computerSelection = null;
  static SHOW_RESULT_DELAY = 3000;
  static COMP_MAX_DELAY = 10000;

  constructor() {
    this.GAME_OPTIONS = ['rock', 'paper', 'scissors'];
    this.gameUI = new GameUI();
  }

  async newGame() {
    this.gameUI.renderGame();
    let roundWinner;

    while (this.#computerScore < 5 && this.#playerScore < 5) {
      this.newRound();
      roundWinner = await this.resolveRound();
      this.updateValues(roundWinner);
    }
  
    // this.finishGame();
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
    ])
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

  updateValues(roundWinner) {
    this.#round++;
    this.#playerSelection = null;
    this.#computerSelection = null;

    if (roundWinner === 'player') this.#playerScore++;
    if (roundWinner === 'computer') this.#computerScore++;
  }

  finishGame() {
    // Should show a modal, with the result and a button to restart the game
  }
}

class GameUI {
  static APPEND_DELAY = 500;
  static APPEND_ANIMATION_DELAY = 1000;

  constructor() {
    this.header = document.querySelector('header');
    this.main = document.querySelector('main');
    this.footer = document.querySelector('footer');
  }

  // General purpose functions

  addClass(elements, className) {
    elements.forEach(element => element.classList.add(className));
  }

  removeElements(elements) {
    elements.forEach(element => element.remove());
  }

  createElement(tag, id, ...classNames) {
    const element = document.createElement(tag);
    if (id) element.setAttribute('id', id);
    classNames.forEach(name => element.classList.add(name));

    return element;
  }

  appendWithDelay(element, parent) {
    setTimeout(() => parent.appendChild(element), GameUI.APPEND_DELAY);
    setTimeout(() => element.classList.add('game-append'), GameUI.APPEND_ANIMATION_DELAY);
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
    
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute('href', url);
    
    svg.appendChild(image);

    return svg;
  }

  createFAsIcon(prefix, iconName) {
    const checkedIcon = document.createElement('i');
    checkedIcon.classList.add(prefix, iconName);
    
    return checkedIcon;
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
    
    this.addClass([startGameButton, quote, rpsTitle], 'hidden');
    setTimeout(() => {
      this.removeElements([startGameButton, quote, rpsTitle])
    }, 500);
  }

  renderGame() {
    this.loadResources();
    this.renderHeader();
    this.renderMain();
  }

  renderHeader() {
    this.roundInfo = this.createElement('h2', 'round-info', 'hidden');
    this.appendWithDelay(this.roundInfo, this.header);
  }

  renderMain() {
    this.main = document.querySelector('main');
    const playPage = this.createElement('div', 'play-page', 'hidden');

    const computerArea = this.createArea('computer');
    const playerArea = this.createArea('player');

    playPage.appendChild(computerArea);
    playPage.appendChild(playerArea);

    this.appendWithDelay(playPage, this.main);
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

    for (let i = 0; i < 5; i++) {
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
    const statusMessage = this.createElement('div', undefined, 'selection-status');
    if (player === 'player') {
      this.playerStatusMessage = statusMessage;
    } else {
      this.computerStatusMessage = statusMessage;
    }
    
    return statusMessage;
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
    iconNames.forEach(name => icons.get(name).classList.toggle('hidden', opacity === 0)); 
  }

  updateOpponentOverlay(isSelected = false) {
    if (this.loadingOverlay.firstChild) {
      this.loadingOverlay.removeChild(this.loadingOverlay.firstChild);
    }

    if (isSelected) {
      this.loadingOverlay.appendChild(this.checkedIcon);
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


  // Game flux control

  renderNewRound(roundNum) {
    this.updateRoundInfo(roundNum);
    this.restoreGameIcons();
    this.updateOpponentOverlay();
    this.loadingOverlay.style.setProperty('opacity', 1);
    this.updateSelectionStatus('player');
    this.updateSelectionStatus('computer');
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


