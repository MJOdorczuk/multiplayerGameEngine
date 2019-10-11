import MouseCoordinates from '../../shared/apiModels/MouseCoordinates';
import NewUser from '../../shared/apiModels/NewUser';
import Player from '../models/Player';
import Bullet from '../models/Bullet';
import GameMap from '../maps/GameMap';

export default interface GameModel {
  steering;
  emitter;
  roomName: string;
  type: string;
  camera: string;
  light: string;
  map: GameMap;
  botsCount: number;
  players: Player[];
  bullets: Bullet[];

  getPlayer(id: string);

  getAlivePlayers();

  getPlayers();

  isPlayerInThisGame(id: string);

  getBullets();

  getMapName();

  getStaticObjects();

  updateBullets();

  detectBulletsCollision();

  shoot(mouseClick: MouseCoordinates);

  revivePlayer(id: string);

  connectPlayer(newPlayer: NewUser);

  disconnectPlayer(disconnected: Player);

  updateKeys(id: string, keys: Array<string>);

  performKeysOperation(player: Player);

  performKeysOperationForPlayers();

  updatePlayerDirection(mouseCoordinates: MouseCoordinates);

  mouseClick(mouseClick: MouseCoordinates);

  mouseUp(mouseClick: MouseCoordinates);

  generateBullets(bullets: Bullet[]);
}
