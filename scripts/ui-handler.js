import { Utils } from "./utils.js";
import { RoundInfo } from "./ui-components/round-info.js";
import { Scoreboard } from "./ui-components/scoreboard.js";
import { GameControls } from "./ui-components/game-controls.js";
import { LoadingOverlay } from "./ui-components/loading-overlay.js";
import { SelectionStatus } from "./ui-components/selection-status.js";
import { RoundResultInfo } from "./ui-components/round-result-info.js";
import { PlayPage } from "./ui-components/play-page.js";
import { EndGameModal } from "./ui-components/end-game-modal.js";

export class UIHandler 
{
  static HIDE_WELCOME_TITLE = 0;
  static REMOVE_WELCOME_TIMEOUT = 500;
  static APPEND_GAMEUI_DELAY = 500;
  static SHOW_GAMEUI_DELAY = 1000;

  // Receives a resetFn from GameHandler
  constructor(maxPoints, resetFn) {
    this.header = document.querySelector('header');
    this.main = document.querySelector('main');
    this.footer = document.querySelector('footer');
    this.wrapper = document.querySelector('#wrapper');

    this.roundInfo = new RoundInfo();
    this.roundResultInfo = new RoundResultInfo();
    this.loadingOverlay = new LoadingOverlay();

    this.computerAreaElements = new Map([
      ['scoreboard', new Scoreboard(maxPoints, Scoreboard.COMPUTER_HEADER)],
      ['controls', new GameControls()],
      ['selectionStatus', new SelectionStatus()],
    ]);

    this.playerAreaElements = new Map([
      ['scoreboard', new Scoreboard(maxPoints, Scoreboard.PLAYER_HEADER)],
      ['controls', new GameControls()],
      ['selectionStatus', new SelectionStatus()]
    ]);

    this.playPage = new PlayPage(
      this.computerAreaElements, this.playerAreaElements
    );

    this.endGameModal = new EndGameModal(resetFn);
  }

  removeWelcome() {
    const startGameButton = document.querySelector('#start-game');
    const quote = document.querySelector('#quote');
    const rpsTitle = document.querySelector('#rps-title');
    const copyright = document.querySelector('#copyright');

    [startGameButton, quote, rpsTitle, copyright].forEach(element => {
      Utils.removeWithDelay(
        element,
        'remove-welcome-transition',
        UIHandler.HIDE_WELCOME_TITLE,
        UIHandler.REMOVE_WELCOME_TIMEOUT
      );
    });
  }

  appendGameUI() {
    const pairsToAppend = new Map([
      [this.header, this.roundInfo.htmlElement],
      [this.main, this.playPage.htmlElement],
    ]);

    pairsToAppend.entries().forEach(([parent, element]) => {
      Utils.appendWithDelay(
        parent, 
        element,
        'append-ui-transition', 
        UIHandler.APPEND_GAMEUI_DELAY, 
        UIHandler.SHOW_GAMEUI_DELAY
      );
    });
  }

  setNewRound(roundNum) {
    this.roundInfo.update(roundNum);

    this.computerAreaElements.get('controls').hideAllIcons();
    

    this.loadingOverlay.clear();

    this.computerAreaElements.get('controls')
      .appendOverlay(this.loadingOverlay);

    this.loadingOverlay.appendLoadingSpinner();

    this.computerAreaElements.get('selectionStatus')
      .setContent(SelectionStatus.COMPUTER_WAITING_TEXT);

    this.playerAreaElements.get('controls').showAllIcons();

    this.playerAreaElements.get('selectionStatus')
      .setContent(SelectionStatus.PLAYER_WAITING_TEXT);
    
    this.roundResultInfo.remove();
  }

  showComputerHasSelected() { 
    this.loadingOverlay.clear();
    this.loadingOverlay.appendCheckedIcon();
    this.computerAreaElements.get('selectionStatus')
      .setContent(SelectionStatus.COMPUTER_SELECTED_TEXT);
  }

  async getPlayerSelection() {
    return this.expectPlayerSelection();
  }


  expectPlayerSelection() {
    return new Promise(resolve => {
      const playerIconsMap = this.playerAreaElements.get('controls').iconsMap;
      const icons = Array.from(playerIconsMap.values());

      const clickHandler = event => {
        // Gets the key in the map searching by the element
        const iconName = Utils.getKey(playerIconsMap, event.currentTarget);

        // Resolves, returning the elements name to the GameHandler
        resolve(iconName);

        this.showPlayerHasSelected(iconName);
        icons.forEach(icon => icon.removeEventListener('click', clickHandler));
      }
  
      icons.forEach(icon => icon.addEventListener('click', clickHandler));
    });
  }

  showPlayerHasSelected(selection) {
    const playerControls = this.playerAreaElements.get('controls');

    Array.from(playerControls.iconsMap.keys())
      .filter(name => name !== selection)
      .forEach(name => playerControls.updateIconsOpacity(0, name));


    this.playerAreaElements.get('selectionStatus')
      .setContent(SelectionStatus.PLAYER_SELECTED_TEXT);  
  }

  showRoundResult(computerSelection, winner) {
    const computerControls = this.computerAreaElements.get('controls');
    computerControls.removeOverlay(this.loadingOverlay);

    computerControls.updateIconsOpacity(1, computerSelection);

    if (winner === 'computer') {
      this.computerAreaElements.get('scoreboard').addOnePoint();
    }

    if (winner === 'player') {
      this.playerAreaElements.get('scoreboard').addOnePoint();
    }

    this.roundResultInfo.showResultMessage(this.footer, winner);
  }

  showGameResult(winner, playerSelection, computerSelection) {
    this.endGameModal.update(winner, playerSelection, computerSelection);
    this.endGameModal.append(this.playPage);
  }

  prepareNextGame() {
    this.endGameModal.remove();
    this.roundInfo.remove();
    this.playPage.remove();
    this.computerAreaElements.get('scoreboard').resetNodes();
    this.playerAreaElements.get('scoreboard').resetNodes();
  }
}