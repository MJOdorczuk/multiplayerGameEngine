import { Unsubscribe } from 'redux';
import GameInstance from '../../shared/apiModels/GameInstance';
import {
  createGamesService,
  gamesListService,
  optionsService,
  store,
  userService,
} from '../store/store';
import { times } from '../../shared/helpers';
import { UserState } from '../store/user/state';
import { GamesListState } from '../store/gamesList/state';

declare var gameNameInput: HTMLInputElement;
declare var gameTypeInput: HTMLSelectElement;
declare var gameMapInput: HTMLSelectElement;
declare var gameLightInput: HTMLSelectElement;
declare var cameraInput: HTMLSelectElement;
declare var steeringInput: HTMLSelectElement;
declare var cursorInput: HTMLSelectElement;
declare var teamsSelect: HTMLSelectElement;
declare var botsCountInput: HTMLInputElement;
declare var teamsCountInput: HTMLInputElement;
declare var teamsRow: HTMLDivElement;
declare var teamsList: HTMLDivElement;
declare var selectTeamSection: HTMLDivElement;
declare var selectTeam: HTMLLabelElement;
declare var createButton: HTMLButtonElement;
declare var gamesListTable: HTMLTableDataCellElement;
declare var nickInput: HTMLInputElement;
declare var blinkingCheckbox: HTMLInputElement;
declare var bulletShadowCheckbox: HTMLInputElement;
declare var joinGameButton: HTMLButtonElement;
declare var menu: HTMLDivElement;
declare var validateGameName: HTMLLabelElement;
declare var validateGameNameDuplicate: HTMLLabelElement;
declare var validateNick: HTMLLabelElement;
declare var validateSelectedGame: HTMLLabelElement;

export default class MenuComponent {
  unsubscribeRender: Unsubscribe;
  listeners: any[] = [];

  constructor(main) {
    this.unsubscribeRender = store.subscribe(() => this.render());

    createButton.addEventListener('click', () => {
      main.onAddNewGame(createGamesService.getNormalizedState());
      createGamesService.clearRoomName();
      gameNameInput.value = '';
    });

    joinGameButton.addEventListener('click', () => {
      menu.style.display = 'none';
      main.onJoinGame();
    });

    gameNameInput.addEventListener('keyup', () => {
      createGamesService.setGameName(gameNameInput.value);
    });

    gameTypeInput.addEventListener('change', () => {
      createGamesService.setGameType(gameTypeInput.value);
      if (gameTypeInput.value === 'Free4all') {
        this.hideTeamsSection();
        this.clearTeamsInputsList();
        createGamesService.disableTeams();
      } else {
        createGamesService.enableTeams();
        this.showTeamsSection();
        this.prepareTeamSection();
      }
    });

    gameLightInput.addEventListener('change', () => {
      createGamesService.setLight(gameLightInput.value);
    });

    cameraInput.addEventListener('change', () => {
      createGamesService.setCamera(cameraInput.value);
    });

    steeringInput.addEventListener('change', () => {
      createGamesService.setSteering(steeringInput.value);
    });

    cursorInput.addEventListener('change', () => {
      createGamesService.setCursor(cursorInput.value);
    });

    gameMapInput.addEventListener('change', () => {
      createGamesService.setGameMap(gameMapInput.value);
    });

    botsCountInput.addEventListener('change', () => {
      if (botsCountInput.value === '') {
        botsCountInput.value = '0';
      }
      createGamesService.setBotsCount(parseInt(botsCountInput.value, 0));
    });

    teamsCountInput.addEventListener('change', () => {
      this.prepareTeamSection();
    });

    teamsSelect.addEventListener('change', () => {
      userService.selectTeam(
        teamsSelect.value,
        gamesListService.getGame(userService.getState().chosenGame),
      );
    });

    nickInput.addEventListener('keyup', () => {
      userService.setNick(nickInput.value);
    });

    blinkingCheckbox.addEventListener('change', () => {
      optionsService.setBlinking(blinkingCheckbox.checked);
    });
    bulletShadowCheckbox.addEventListener('change', () => {
      optionsService.setBulletShadow(bulletShadowCheckbox.checked);
    });
  }

  toggleSelectTeamSection() {
    const user = userService.getState();
    const chosenGame = user.chosenGame;
    const chosenTeam = user.team;
    const teams = gamesListService.getGame(chosenGame).teams;
    if (teams?.length > 0) {
      selectTeamSection.style.display = 'block';
      const options = teams.map(team => {
        const option = document.createElement('option');
        option.value = team.name;
        option.innerText = `${team.name} players: ${team.count}`;
        return option;
      });
      teamsSelect.innerHTML = '';
      teamsSelect.append(...options);
      teamsSelect.value = chosenTeam;
    } else {
      selectTeamSection.style.display = 'none';
    }
  }

  prepareTeamSection() {
    if (teamsCountInput.value === '') {
      teamsCountInput.value = '2';
    }
    const value = parseInt(teamsCountInput.value, 0);
    createGamesService.setTeamsCount(value);
    this.prepareTeamsInputsList(value);
  }

  clearTeamsInputsList() {
    teamsList.childNodes.forEach((input, index) =>
      input.removeEventListener('keyup', this.listeners[index]),
    );
    this.listeners = [];
    teamsList.innerHTML = '';
  }

  prepareTeamsInputsList(count: number) {
    this.clearTeamsInputsList();
    times(count, index => {
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('data-event', 'text');
      const listeners = this.listeners;
      input.addEventListener('keyup', function inputListener() {
        createGamesService.setTeamName(index, input.value);
        listeners.push(inputListener);
      });
      teamsList.appendChild(input);
    });
  }

  renderTable(user: UserState, games: GamesListState) {
    games.list.forEach((game: GameInstance) => {
      const roomName = document.createElement('td');
      roomName.appendChild(document.createTextNode(game.roomName));
      const type = document.createElement('td');
      type.appendChild(document.createTextNode(game.type));
      const map = document.createElement('td');
      map.appendChild(document.createTextNode(game.map));
      const count = document.createElement('td');
      count.appendChild(document.createTextNode(game.count.toString()));
      const row = document.createElement('tr');
      row.addEventListener('click', () => {
        userService.selectGame(game);
        this.toggleSelectTeamSection();
      });
      if (user.chosenGame === game.roomName) {
        row.classList.add('active');
      }
      // @ts-ignore
      row.append(roomName, type, map, count);
      // @ts-ignore
      gamesListTable.append(row);
    });
  }

  render() {
    gamesListTable.innerHTML = '';
    const user = userService.getState();
    const games = gamesListService.getState();
    const createGame = createGamesService.getState();
    this.renderTable(user, games);
    const nickEmpty = user.nick === '';
    const chosenGameEmpty = user.chosenGame === null;
    const idEmpty = user.id === null;
    const roomNameEmpty = createGame.roomName === '';
    const roomNameDuplicate = Boolean(
      games.list.find(game => game.roomName === createGame.roomName),
    );
    const typeEmpty = createGame.type === null;
    const mapEmpty = createGame.map === null;

    joinGameButton.disabled = nickEmpty || chosenGameEmpty || idEmpty;
    createButton.disabled = roomNameEmpty || typeEmpty || mapEmpty || roomNameDuplicate;

    validateNick.style.display = nickEmpty ? 'block' : 'none';
    validateSelectedGame.style.display = chosenGameEmpty ? 'block' : 'none';
    validateGameName.style.display = roomNameEmpty ? 'block' : 'none';
    validateGameNameDuplicate.style.display = roomNameDuplicate ? 'block' : 'none';
  }

  closePopup() {
    location.hash = '';
  }

  togglePopup(e: KeyboardEvent, key: string, popupId: string) {
    if (e.key === key) {
      location.hash = location.hash === popupId ? '' : popupId;
    }
  }

  requestFullscreen(e: KeyboardEvent, key: string) {
    if (e.key === key) {
      document.body.requestFullscreen();
    }
  }

  showTeamsSection() {
    teamsRow.style.display = 'block';
  }

  hideTeamsSection() {
    teamsRow.style.display = 'none';
  }

  show() {
    menu.style.display = 'block';
  }

  hide() {
    menu.style.display = 'none';
    this.unsubscribeRender();
  }
}
