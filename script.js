const GAME_OPTIONS = ['Rock', 'Paper', 'Scissors'];

let playerScore = 0;
let computerScore = 0;

let gameColor = '#c965b9';

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

document.body.appendChild(wrapper);

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

function newGame() {

  playerScore = 0;
  computerScore = 0;
}

