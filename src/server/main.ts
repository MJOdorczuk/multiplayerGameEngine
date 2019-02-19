import * as express from 'express';
import * as http from 'http';
import { listen, Socket } from 'socket.io';

import GamesStore from './services/GamesStore';
import NewPlayer from '../shared/apiModels/NewPlayer';
import MouseCoordinates from '../shared/apiModels/MouseCoordinates';
import NewGame from '../shared/apiModels/NewGame';
import { API } from '../shared/constants';
import Bullet from './models/Bullet';
import Player from './models/Player';

const TIMEOUT = 1000;
const port = process.env.PORT || '80';
const app = express();
const httpServer = http.createServer(app);
const socketIo = listen(httpServer);
const gamesStory = new GamesStore();

app.use(express.static('dist/client'));

class Connection {
  player: Player;
  gameName: string;
  gameState: any;

  constructor(private socket: Socket) {
    this.init();
  }

  init() {
    console.log(`[${this.socket.id}] Connected`);
    setTimeout(() => {
      socketIo.emit(API.GET_GAMES_LIST, gamesStory.getGamesList());
      this.socket.emit(API.WELCOME_NEW_PLAYER, this.socket.id);
    }, TIMEOUT);
    this.registerGameMenuEvents();
  }

  registerGameMenuEvents() {
    this.socket.on(API.CREATE_GAME, (newGame: NewGame) => {
      console.log(`[${this.socket.id}] Created game '${newGame.name}'`);
      gamesStory.createGame(this, newGame.name, newGame.type, newGame.map);
      socketIo.emit(API.GET_GAMES_LIST, gamesStory.getGamesList());
    });

    this.socket.on(API.CREATE_PLAYER, (newPlayer: NewPlayer) => {
      this.gameState = gamesStory.getGame(newPlayer.gameName);
      if (this.gameState) {
        this.gameName = this.gameState.name;
        console.log(`[${this.socket.id}] Player '${newPlayer.name}' joined to '${this.gameName}'`);
        this.joinToRoom();
        this.initNewPlayer(newPlayer);
        this.registerPlayerEvents();
      }
    });

    this.socket.on(API.DISCONNECT, () => {
      console.log(`[${this.socket.id}] Disconnected`);
      if (this.gameState) {
        const disconnected = this.gameState.getPlayer(this.socket.id);
        this.gameState.disconnectPlayer(disconnected);
        this.disconnectPlayer(disconnected.name);
      }
    });
  }

  joinToRoom() {
    this.socket.join(this.gameName);
  }

  initNewPlayer(newPlayer) {
    this.player = this.gameState.connectPlayer(this.socket.id, newPlayer);
    socketIo.to(this.gameName).emit(API.ADD_NEW_PLAYER, this.player);
    socketIo.to(this.gameName).emit(API.ADD_PLAYERS, this.gameState.getPlayers());
    socketIo.to(this.gameName).emit(API.GET_STATIC_OBJECTS, this.gameState.getStaticObjects());
    socketIo.emit(API.GET_GAMES_LIST, gamesStory.getGamesList());
  }

  registerPlayerEvents() {
    this.socket.on(API.UPDATE_KEYS, (keys: Array<string>) => {
      this.gameState.updateKeys(this.socket.id, keys);
    });
    this.socket.on(API.MOUSE_CLICK, (mouseClick: MouseCoordinates) => {
      this.gameState.mouseClick(mouseClick);
    });
    this.socket.on(API.UPDATE_DIRECTION, (mouseCoordinates: MouseCoordinates) => {
      this.gameState.updatePlayerDirection(mouseCoordinates);
    });
  }

  emitGameState(gameState) {
    socketIo.to(gameState.name).emit(API.GET_PLAYERS_STATE, gameState.getPlayers());
    socketIo.to(gameState.name).emit(API.GET_BULLETS, gameState.getBullets());
  }

  disconnectPlayer(name) {
    console.log(`[${this.socket.id}] Player '${name}' left '${this.gameName}'`);
    socketIo.to(this.gameName).emit(API.DISCONNECT_PLAYER, this.socket.id);
    socketIo.emit(API.GET_GAMES_LIST, gamesStory.getGamesList());
    this.socket.emit(API.LEAVE_GAME);
    this.socket.leave(this.gameName);
    // this.socket.removeAllListeners(API.UPDATE_KEYS);
    // this.socket.removeAllListeners(API.MOUSE_CLICK);
    // this.socket.removeAllListeners(API.UPDATE_DIRECTION);
    // delete this.gameState;
    // delete this.gameName;
    // delete this.player;
  }

  sendNewBullet(bullet: Bullet) {
    socketIo.to(this.gameName).emit(API.ADD_NEW_BULLET, bullet);
  }
}

socketIo.on(API.CONNECTION, (socket: Socket) => {
  new Connection(socket);
});

httpServer.listen(parseInt(port, 0), function() {
  console.log(`App listening on *:${port}`);
});
