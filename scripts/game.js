import { UIHandler } from "./ui-handler.js";

export class Game 
{
  #round;
  #playerScore;
  #computerScore;
  #playerSelection = null;
  #computerSelection = null;
  static SHOW_RESULT_DELAY = 2000;
  static COMP_MAX_DELAY = 6000;
  static MAX_POINTS = 5;

  constructor() {
    this.GAME_OPTIONS = ['rock', 'paper', 'scissors'];
    this.uiHandler = new UIHandler(Game.MAX_POINTS);
  }

  async newGame() {
    this.#round = 1;
    this.#playerScore = 0;
    this.#computerScore = 0;
    this.uiHandler.appendGameUI();

    let roundWinner;

    while (true) {
      this.newRound();
      roundWinner = await this.resolveRound();
      this.updateScoreValues(roundWinner);

      if (this.#playerScore >= Game.MAX_POINTS) {
        this.finishGame('player');
        return;
      }

      if (this.#computerScore >= Game.MAX_POINTS) {
        this.finishGame('computer');
        return;
      }
    }
  }

  newRound() {
    this.uiHandler.setNewRound(this.#round);
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