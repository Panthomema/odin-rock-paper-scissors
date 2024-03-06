import { Utils } from "./utils.js";
import { RoundInfo } from "./ui-elements/round-info.js";
import { Scoreboard } from "./ui-elements/scoreboard.js";
import { GameControls } from "./ui-elements/game-controls.js";
import { LoadingOverlay } from "./ui-elements/loading-overlay.js";
import { SelectionStatus } from "./ui-elements/selection-status.js";
import { RoundResultInfo } from "./ui-elements/round-result-info.js";
import { PlayPage } from "./ui-elements/play-page.js";

export class UIHandler 
{
  static REMOVE_WELCOME_TIMEOUT = 500;
  static APPEND_GAMEUI_DELAY = 500;
  static SHOW_GAMEUI_DELAY = 1000;

  constructor(maxPoints) {
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
  }

  removeWelcome() {
    const startGameButton = document.querySelector('#start-game');
    const quote = document.querySelector('#quote');
    const rpsTitle = document.querySelector('#rps-title');
    const copyright = document.querySelector('#copyright');

    Utils.addClassToElements(
      'hidden',
      startGameButton, 
      quote, 
      rpsTitle, 
      copyright
    );

    setTimeout(() => {
      Utils.removeElements(startGameButton, quote, rpsTitle, copyright)
    }, UIHandler.REMOVE_WELCOME_TIMEOUT);
  }

  appendGameUI() {
    const pairsToAppend = new Map([
      [this.header, this.roundInfo.htmlElement],
      [this.main, this.playPage.htmlElement],
      [this.footer, this.roundResultInfo.htmlElement]
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
    
    this.roundResultInfo.clear();
  }

  showComputerHasSelected() { 
    this.loadingOverlay.clear();
    this.loadingOverlay.appendCheckedIcon();
    this.computerAreaElements.get('selectionStatus')
      .setContent(SelectionStatus.COMPUTER_SELECTED_TEXT);
  }

  async getPlayerSelection() {
    return await this.playerAreaElements.get('controls').attachPlayerSelectionEvents(this.showPlayerHasSelected.bind(this));
  }

  
  showPlayerHasSelected(selection) {
    this.playerAreaElements.get('selectionStatus')
      .setContent(SelectionStatus.PLAYER_SELECTED_TEXT);
  }
}