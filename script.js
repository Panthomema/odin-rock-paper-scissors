class Game{
  #round = 1;
  #playerScore = 0;
  #computerScore = 0;

  constructor() {
    this.GAME_OPTIONS = ['Rock', 'Paper', 'Scissors'];
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
    
    this.gameUI.appendRoundInfo(this.#round);
    this.gameUI.appendPlayPage();

    this.newRound();
  }

  newRound() {

  }
}

class GameUI {

  constructor(gameLogic) {
    this.startGameButton = document.querySelector('#start-game');
    this.quote = document.querySelector('#quote');
    this.header = document.querySelector('header');
    this.rpsTitle = document.querySelector('#rps-title');
  }

  removeFront() {
    this.startGameButton.classList.add('front-remove');
    this.quote.classList.add('front-remove');
    this.rpsTitle.classList.add('front-remove');

    setTimeout(() => {
      this.startGameButton.remove();
      this.quote.remove();
      this.rpsTitle.remove();
    }, 500);
  }

  appendRoundInfo(roundNum) {
    this.roundInfo = document.createElement('h2');
    this.roundInfo.setAttribute('id', 'round-info');
    this.roundInfo.classList.add('addable');
    this.roundInfo.textContent = `Round ${roundNum}`;

    setTimeout(() => this.header.appendChild(this.roundInfo), 500);
    setTimeout(() => this.roundInfo.classList.add('game-append'), 1000);
  }

  appendPlayPage() {
    this.main = document.querySelector('main');
    this.playPage = document.createElement('div');
    this.playPage.setAttribute('id', 'play-page');
    this.playPage.classList.add('addable');

    this.computerArea = this.generateArea('computer');
    this.playerArea = this.generateArea('player');

    this.playPage.appendChild(this.computerArea);
    this.playPage.appendChild(this.playerArea);

    setTimeout(() => this.main.appendChild(this.playPage), 500);
    setTimeout(() => this.playPage.classList.add('game-append'), 1000);
  }

  generateArea(playerType) {
    const area = document.createElement('div');
    area.setAttribute('id', `${playerType}-area`);
    area.appendChild(this.generateScoreboard(playerType));
    area.appendChild(this.generateGameControls(playerType));
    area.appendChild(this.generateSelectionStatus(playerType));

    return area;
  }

  generateScoreboard(playerType) {
    const scoreboard = document.createElement('div');
    scoreboard.classList.add('scoreboard')

    const title = document.createElement('h3');
    title.textContent = `${(playerType === 'player') 
                            ? 'YOUR'
                            : 'OPPONENT\'S'
                          } SCORE`;

    scoreboard.appendChild(title);


    scoreboard.appendChild(this.generateScore(0));

    return scoreboard;
  } 

  generateScore(points) {
    const score = document.createElement('div');
    score.classList.add('score');

    for (let i = 0; i < points; i++) {
      const filledScoreNode = document.createElement('i');
      filledScoreNode.classList.add('fas', 'fa-circle');
      score.appendChild(filledScoreNode);
    }

    for (let i = points; i < 5; i++) {
      const emptyScoreNode = document.createElement('i');
      emptyScoreNode.classList.add('far', 'fa-circle');
      score.appendChild(emptyScoreNode);
    }

    return score;
  }

  generateGameControls(playerType) {
    const controls = document.createElement('div');
    controls.classList.add('game-controls');

    this.loadIcons();
    const rockIcon = this.rockIcon;
    const paperIcon = this.paperIcon;
    const scissorsIcon = this.scissorsIcon;

    [rockIcon, paperIcon, scissorsIcon].forEach(icon => {
      controls.appendChild(icon);
      if (playerType === 'computer') icon.style.opacity = 0;
    });

    
    if (playerType === 'computer') {
      const loadingOverlay = this.generateOpponentOverlay();
      controls.appendChild(loadingOverlay);
    }
    

    return controls;
  }

  generateOpponentOverlay() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.setAttribute('id', 'loading-overlay');

    const lottiePlayer = document.createElement('lottie-player');
    const properties = {
      'src': 'https://lottie.host/8588aecb-1b4b-48e1-a569-e63734975c1e/gA4wf2wLSp.json',
      'autoplay': '',
      'loop': '',
      'mode': 'normal',
    };

    Object.entries(properties).forEach(([attribute, value]) => {
      lottiePlayer.setAttribute(attribute, value);
    });

    loadingOverlay.appendChild(lottiePlayer);

    return loadingOverlay;
  }

  loadIcons() {
    this.rockIcon = this.generateSVGIcon(
      'https://img.icons8.com/3d-fluency/200/coal.png', 'game-icon'
    );

    this.paperIcon = this.generateSVGIcon(
      'https://img.icons8.com/3d-fluency/200/scroll.png', 'game-icon'
    );

    this.scissorsIcon = this.generateSVGIcon(
      'https://img.icons8.com/3d-fluency/200/cut.png', 'game-icon'
    );
  }

  generateSVGIcon(url, className) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add(className);
    
    let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute('href', url);
    
    svg.appendChild(image);

    return svg;
  }

  generateSelectionStatus(playerType, isSelected = false) {
    const statusMessage = document.createElement('div');
    statusMessage.classList.add('selection-status');
    
    statusMessage.textContent = (isSelected)
      ? (playerType === 'player') ? 'You made a pick' : 'Opponent made a pick'
      : (playerType === 'player') ? 'Take your pick' : 'Waiting for the opponent';

    return statusMessage;
  }
}




document.addEventListener('DOMContentLoaded', () => {
  
  const startGameButton = document.querySelector('#start-game');

  startGameButton.addEventListener('mousedown', () => {
    startGameButton.classList.add('clicked');
  });

  startGameButton.addEventListener('mouseup', () => {
    startGameButton.classList.remove('clicked');
  });

  startGameButton.addEventListener('click', () => {
    const game = new Game();
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

/*
function newGame() {

  playerScore = 0;
  computerScore = 0;
}
*/

