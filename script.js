const GAME_OPTIONS = ['Rock', 'Paper', 'Scissors'];


function getComputerChoice() {

  return GAME_OPTIONS[Math.floor(Math.random() * 3)];

}

function getPlayerChoice() {

  let playerInput;
  let playerChoice;

  do {

    playerInput = prompt('Rock, paper, scissors!!');
    playerChoice = GAME_OPTIONS.find(option => option.toUpperCase() === playerInput.toUpperCase());

  } while (!playerChoice);

  return playerChoice;
}


function playRound(playerSelection, computerSelection) {
  
  let roundResult;
  let playerWins;

  if (playerSelection === computerSelection) {
    
    alert('Tie!');
    return playRound(getPlayerChoice(), getComputerChoice());

  } else {

    switch (playerSelection) {

      case 'Rock':
        return (computerSelection === 'Scissors') ? true : false;
     
      case 'Paper':
        return (computerSelection === 'Rock') ? true : false;

      case 'Scissors':
        return (computerSelection === 'Paper') ? true : false;

    }

  }

}

function game() {

  let playerScore = 0;
  let computerScore = 0;

  do {

    if(playRound(getPlayerChoice(), getComputerChoice())) {

      playerScore++;
      console.log(`You win this round! Score is ${playerScore} - ${computerScore}`);

    } else {

      computerScore++;
      console.log(`You lose this round! Score is ${playerScore} - ${computerScore}`);

    }
    
  } while (playerScore < 3 && computerScore < 3);

  console.log(`It's over! ${(playerScore === 3) ? 'You win' : 'Computer wins'} the game!`);
}