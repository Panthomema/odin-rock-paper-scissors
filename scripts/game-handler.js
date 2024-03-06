import { Utils } from "./utils.js";
import { UIHandler } from "./ui-handler.js";

export class GameHandler 
{
  #round;
  #playerScore;
  #computerScore;
  #playerSelection = null;
  #computerSelection = null;
  static SHOW_RESULT_DELAY = 2000;
  static COMPUTER_MAX_DELAY = 6000;
  static MAX_POINTS = 5;

  constructor() {
    this.GAME_OPTIONS = ['rock', 'paper', 'scissors'];
    this.uiHandler = new UIHandler(GameHandler.MAX_POINTS);
  }

  async newGame() {
    this.#round = 1;
    this.#playerScore = 0;
    this.#computerScore = 0;
    this.uiHandler.appendGameUI();

    let roundWinner;

    while (true) {
      this.uiHandler.setNewRound();
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

  async resolveRound() {
    [this.#computerSelection, this.#playerSelection] = await this.playRound();

    const roundWinner = this.determineWinner();
    this.gameUI.showRoundResult(this.#computerSelection, roundWinner);
    await Utils.delay(Game.SHOW_RESULT_DELAY);

    return roundWinner;
  }

  async playRound() {
    return Promise.all([
      this.getComputerSelection(),
      this.uiHandler.getPlayerSelection(),
    ]);
  }

  async getComputerSelection() {
    const randomDelay = Math.floor(
      Math.random() * GameHandler.COMPUTER_MAX_DELAY
    ) + 1000;

    await Utils.delay(randomDelay);

    return this.generateComputerChoice();
  }

  generateComputerChoice() {
    this.uiHandler.showComputerHasSelected();
    return this.GAME_OPTIONS[Math.floor(Math.random() * 3)];
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