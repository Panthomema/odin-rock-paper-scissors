class Game{
  #round = 1;
  #playerScore = 0;
  #computerScore = 0;

  constructor() {
    this.GAME_OPTIONS = ['rock', 'paper', 'scissors'];
    this.gameUI = new GameUI();
  }

  getRound() {
    return this.#round;
  }

  setRound(value) {
    this.#round = value;
  }

  getPlayerScore() {
    return this.#playerScore;
  }

  setPlayerScore(value) {
    this.#playerScore = value;
  }

  getComputerScore() {
    return this.#computerScore;
  }

  setComputerScore(value) {
    this.#computerScore = value;
  }

  newGame() {
    this.gameUI.renderGame();

    /*
    while (this.#computerScore < 5 && this.#playerScore < 5) {
      
      Here we need an async function that waits for the user to select,
      and for the computer to select (i will set a timeout to CPU selection)
      this.resolveRound();
    }
    */

    this.newRound();
    
    //this.finishGame();
  }

  newRound() {
    this.gameUI.renderNewRound(this.#round);
  }

  resolveRound() {
    // Should make the calculations, updates of game class props, and call the result rendering
  }
}

class GameUI {

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
    setTimeout(() => parent.appendChild(element), 500);
    setTimeout(() => element.classList.add('game-append'), 1000);
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

  removeFront() {
    const startGameButton = document.querySelector('#start-game');
    const quote = document.querySelector('#quote');
    const rpsTitle = document.querySelector('#rps-title');
    
    this.addClass([startGameButton, quote, rpsTitle], 'front-remove');
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
    this.roundInfo = this.createElement('h2', 'round-info', 'addable');
    this.appendWithDelay(this.roundInfo, this.header);
  }

  renderMain() {
    this.main = document.querySelector('main');
    const playPage = this.createElement('div', 'play-page', 'addable');

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
    area.appendChild(this.generateGameControls(player));
    area.appendChild(this.createSelectionStatus(player));

    return area;
  }

  createScoreboard(player) {
    const scoreboard = this.createElement('div', undefined, 'scoreboard');

    const title = this.createElement('h3');
    let scoreTable;

    if (player === 'player') {
      title.textContent = 'PLAYER SCORE';
      this.playerScore = this.createScoreNodes();
      scoreTable = this.playerScore;
    } else {
      title.textContent = 'OPPONENT\'S SCORE';
      this.computerScore = this.createScoreNodes();
      scoreTable = this.computerScore;
    }

    scoreboard.appendChild(title);
    scoreboard.appendChild(scoreTable);

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

  // UI elements modification

  updateRoundInfo(roundNum) {
    this.roundInfo.textContent = `Round ${roundNum}`;
  }

  updateScoreNodes(player) {
    const scoreNodes = (player === 'player') 
                          ? this.playerScore 
                          : this.computerScore;
    
    const nextPoint = scoreNodes.querySelector('.fa-circle');

    if (nextPoint) {
      nextPoint.classList.replace('fa-circle', 'fa-check-circle');
    }
  }






  
  

  showRoundResult(winner) {
    // Will hide wheel show both selections, update the round winner score, and a YOU WIN/LOSE msg
  }

  renderNewRound(roundNum) {
    this.updateRoundInfo(roundNum);
    this.updateOpponentOverlay();
    this.loadingOverlay.style.opacity = 1;
  }

  

  generateGameControls(player) {
    const controls = this.createElement('div', undefined, 'game-controls');
    
    const icons = Array.from((player === 'player')
                                ? this.playerIcons.values()
                                : this.computerIcons.values()
                            );
    

    icons.forEach(icon => {
      controls.appendChild(icon);
      if (player === 'computer') icon.style.opacity = 0;
    });

    
    if (player === 'computer') {
      this.loadingOverlay = this.generateOpponentOverlay();
      controls.appendChild(this.loadingOverlay);
    }

    return controls;
  }

  generateOpponentOverlay() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.setAttribute('id', 'loading-overlay');

    return loadingOverlay;
  }

  updateOpponentOverlay(isSelected = false) {
    this.loadingOverlay.appendChild(
      (isSelected) ? this.checkedIcon : this.loadingWheel
    );
  }

  

  // Fusionar updateOpponentOverlay con updateSelectionStatus¿?

  createSelectionStatus(player) {

  }
  

  generateSelectionStatus(player, isSelected = false) {
    const statusMessage = document.createElement('div');
    statusMessage.classList.add('selection-status');
    
    statusMessage.textContent = (isSelected)
      ? (player === 'player') ? 'You made a pick' : 'Opponent made a pick'
      : (player === 'player') ? 'Take your pick' : 'Waiting for the opponent';

    return statusMessage;
  }
}

const game = new Game();


document.addEventListener('DOMContentLoaded', () => {
  
  const startGameButton = document.querySelector('#start-game');
  startGameButton.addEventListener('mousedown', () => {
    startGameButton.classList.add('clicked');
  });

  startGameButton.addEventListener('mouseup', () => {
    startGameButton.classList.remove('clicked');
  });

  startGameButton.addEventListener('click', () => {
    game.gameUI.removeFront();
    game.newGame(); 
  });
});








let style = document.createElement('style');
let gameControlClass =
  `.game-control { border: none; background-color: #fff; font-size: 20px; color: ${gameColor}; padding: 10px; border-radius: 2px; cursor: pointer }`;

let gameControlHover = '.game-control:hover { transform: scale(0.9) }';

style.appendChild(document.createTextNode(gameControlClass));
style.appendChild(document.createTextNode(gameControlHover));
document.head.appendChild(style);

const wrapper = document.createElement('div');
wrapper.setAttribute('id', 'wrapper');
wrapper.style.width = '100%';
wrapper.style.height = '90vh';
wrapper.style.display = 'flex';
wrapper.style.justifyContent = 'center';
wrapper.style.alignItems = 'center';
wrapper.style.flexDirection = 'column';

const title = document.createElement('h1');
title.textContent = 'LET\'S PLAY!';
title.style.color = gameColor;
title.style.cursor = 'pointer';

const gameControls = document.createElement('div');
gameControls.setAttribute('id', 'game-controls');
gameControls.style.display = 'flex';
gameControls.style.gap = '10px';
gameControls.style.justifyContent = 'space-around';
gameControls.style.background = gameColor;
gameControls.style.padding = '25px';
gameControls.style.borderRadius = '5px';

const rockButton = document.createElement('button');
rockButton.textContent = 'ROCK';
rockButton.value = 'Rock';
rockButton.classList.add('game-control');

const paperButton = document.createElement('button');
paperButton.textContent = 'PAPER';
paperButton.value = 'Paper';
paperButton.classList.add('game-control');

const scissorsButton = document.createElement('button');
scissorsButton.textContent = 'SCISSORS';
scissorsButton.value = 'Scissors';
scissorsButton.classList.add('game-control');

gameControls.appendChild(rockButton);
gameControls.appendChild(paperButton);
gameControls.appendChild(scissorsButton);

const resultsTextbox = document.createElement('div');
resultsTextbox.setAttribute('id', 'results-textbox');
resultsTextbox.style.textAlign = 'center';
resultsTextbox.style.color = gameColor;
resultsTextbox.style.display = 'flex';
resultsTextbox.style.flexDirection = 'column';
resultsTextbox.style.padding = '25px';
resultsTextbox.style.maxWidth = '350px';

const score = document.createElement('h1');
score.textContent = `${playerScore} - ${computerScore}`;
resultsTextbox.appendChild(score);

const roundMessage = document.createElement('div');
roundMessage.setAttribute('id', 'round-message');
roundMessage.style.width = '100%';

const roundResult = document.createElement('h3');
roundMessage.appendChild(roundResult);

const roundLog = document.createElement('p');
roundLog.style.textAlign = 'left';
roundLog.style.fontSize = '18px';
roundMessage.appendChild(roundLog);

resultsTextbox.appendChild(roundMessage);

title.addEventListener('click', () => {

  wrapper.removeChild(title);
  wrapper.appendChild(gameControls);
  wrapper.appendChild(resultsTextbox);
  newGame();

  const gameButtons = document.querySelectorAll('.game-control');

  gameButtons.forEach(button => {

    button.addEventListener('click', e => {

      playRound(e.target.value, getComputerChoice());

    });

  });
});


wrapper.appendChild(title);

//document.body.appendChild(wrapper);

function getComputerChoice() {

  return GAME_OPTIONS[Math.floor(Math.random() * 3)];

}


function playRound(playerSelection, computerSelection) {

  let playerWins = true;

  if (playerSelection === computerSelection) {

    resolveRound('tie', playerSelection, computerSelection);

  } else {

    switch (playerSelection) {

      case 'Rock':
        playerWins = (computerSelection === 'Scissors');
        break;

      case 'Paper':
        playerWins = (computerSelection === 'Rock');
        break;

      case 'Scissors':
        playerWins = (computerSelection === 'Paper');
        break;
    }

    resolveRound((playerWins) ? 'player' : 'computer', playerSelection, computerSelection);

  }

}

function resolveRound(result, playerSelection, computerSelection) {

  switch (result) {

    case 'player':
      playerScore++;
      roundResult.textContent = 'YOU WIN!';
      break;

    case 'computer':
      computerScore++;
      roundResult.textContent = 'COMPUTER WINS!';
      break;

    default:
      roundResult.textContent = 'TIE!';
      break;
  }

  if (playerScore === 5 || computerScore === 5) {

    roundResult.textContent = 'GAME OVER!';
    roundLog.textContent = `${(playerScore > computerScore) ? 'Player' : 'Computer'} wins the game!`;
    wrapper.removeChild(gameControls);

  } else {

    roundLog.textContent = `You selected ${playerSelection} and computer selected ${computerSelection}`;

  }

  score.textContent = `${playerScore} - ${computerScore}`;
}

