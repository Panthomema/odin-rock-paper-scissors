import { UIHelper } from "./ui-helper.js";
import { RoundInfo } from "./round-info.js";
import { Scoreboard } from "./scoreboard.js";
import { GameControls } from "./game-controls.js";
import { LoadingOverlay } from "./loading-overlay.js";
import { SelectionStatus } from "./selection-status.js";
import { RoundResultInfo } from "./round-result-info.js";
import { PlayPage } from "./play-page.js";

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

    UIHelper.addClassToElements(
      'hidden',
      startGameButton, 
      quote, 
      rpsTitle, 
      copyright
    );

    setTimeout(() => {
      UIHelper.removeElements(startGameButton, quote, rpsTitle, copyright)
    }, UIHandler.REMOVE_WELCOME_TIMEOUT);
  }

  appendGameUI() {
    const pairsToAppend = new Map([
      [this.header, this.roundInfo.htmlElement],
      [this.main, this.playPage.htmlElement],
      [this.footer, this.roundResultInfo.htmlElement]
    ]);

    pairsToAppend.entries().forEach(([parent, element]) => {
      UIHelper.appendWithDelay(
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
}