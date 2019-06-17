import collisionDetector from '../services/CollisionDetector';
import Bullet from '../models/Bullet';
import Player from '../models/Player';
import NewUser from '../../shared/apiModels/NewUser';
import MouseCoordinates from '../../shared/apiModels/MouseCoordinates';
import GameMap from '../maps/GameMap';
import GameModel from './GameModel';
import Direction from '../../shared/models/Direction';
import { rand } from '../../shared/helpers';
import ItemGeneratorAPI from '../../shared/apiModels/ItemGenerator';
import Weapon from '../models/weapons/Weapon';
import Emitter from '../services/Emitter';

export default class Free4all implements GameModel {
  public type: string = 'Free for all';
  private interval;

  constructor(
    public emitter: Emitter,
    public roomName: string,
    public map: GameMap,
    public players: Player[] = [],
    public bullets: Bullet[] = [],
  ) {
    this.interval = setInterval(() => {
      this.updatePlayersPosition();
      this.updateBullets();
      this.detectBulletsCollision();
      this.emitter.emitGameState(this);
    }, 1000 / 60);
  }

  getPlayer(id: string) {
    return this.players.find(player => player.id === id);
  }

  alivePlayers() {
    return this.players.filter(player => player.alive === true);
  }

  getPlayers() {
    return this.players;
  }

  isPlayerInThisGame(id: string) {
    return this.players.find(player => player.id === id);
  }

  getBullets() {
    return this.bullets.map(bullet => ({
      id: bullet.id,
      x: bullet.x,
      y: bullet.y,
      size: bullet.size,
    }));
  }

  getMapName() {
    return this.map.getMapName();
  }

  getStaticObjects() {
    return this.map.getStaticObjects();
  }

  getItemGenerators() {
    return this.map.getItemGenerators();
  }

  getItemGeneratorsAPI() {
    return this.getItemGenerators().map(itemGenerator => new ItemGeneratorAPI(itemGenerator));
  }

  deleteBulletIfInactive(bullet: Bullet, i) {
    if (!bullet.isActive()) {
      this.bullets.splice(i, 1);
    }
  }

  updateBullets() {
    this.bullets.forEach((bullet, i) => {
      bullet.updatePosition();
      this.deleteBulletIfInactive(bullet, i);
    });
  }

  detectBulletsCollision() {
    this.bullets.forEach((bullet, i) => {
      [...this.getStaticObjects(), ...this.alivePlayers()].forEach((object: Player) => {
        if (bullet.owner !== object) {
          const bulletDirection = {
            x: bullet.directionX,
            y: bullet.directionY,
          };
          const { yes, angle } = collisionDetector.detectCollision(bullet, object, bulletDirection);
          if (yes) {
            object.hitFromBullet(bullet, angle);
            this.deleteBulletIfInactive(bullet, i);
          } else if (object.aura) {
            if (collisionDetector.detectCollision(bullet, object.aura, bulletDirection).yes) {
              bullet.decreaseSpeed();
            } else {
              bullet.increaseSpeed();
            }
          }
        }
      });
    });
  }

  shoot(mouseClick: MouseCoordinates) {
    const owner = this.getPlayer(mouseClick.owner);
    if (owner) {
      const bullets = owner.shoot(mouseClick, this.roomName);
      if (bullets && bullets.length > 0) {
        this.bullets.push(...bullets);
        return {
          owner,
          bullets: bullets.map(bullet => ({
            id: bullet.id,
            size: bullet.size,
            color: bullet.color,
          })),
        };
      }
    }
  }

  generateBullets(bullets: Bullet[]) {
    this.bullets.push(...bullets);
    this.emitter.sendNewBullets(
      this.roomName,
      bullets.map(bullet => ({
        id: bullet.id,
        size: bullet.size,
        color: bullet.color,
      })),
    );
  }

  revivePlayer(id: string) {
    const player = this.getPlayer(id);
    player && !this.detectPlayerCollision(player) && player.revive();
  }

  connectPlayer(id: string, newPlayer: NewUser): Player {
    const player = new Player(id, newPlayer.name, newPlayer.color, rand(1000), rand(1000));
    this.getWeaponInfo(player);
    this.players.push(player);
    return player;
  }

  disconnectPlayer(disconnected: Player) {
    this.players.splice(this.players.indexOf(disconnected), 1);
    this.emitter.disconnectPlayer(this.roomName, disconnected);
  }

  updateKeys(id: string, keys: Array<string>) {
    const player = this.getPlayer(id);
    player && (player.keys = new Set(keys));
  }

  updatePlayersPosition() {
    this.players.forEach(player => this.updatePlayerPosition(player));
  }

  updatePlayerPosition(player: Player) {
    if (player) {
      if (player.keys.has('W') || player.keys.has('ArrowUp')) {
        if (
          !player.isAlive() ||
          !this.detectPlayerCollision(player, {
            x: 0,
            y: player.speed,
          })
        ) {
          player.goDown();
        }
      }
      if (player.keys.has('S') || player.keys.has('ArrowDown')) {
        if (
          !player.isAlive() ||
          !this.detectPlayerCollision(player, {
            x: 0,
            y: -player.speed,
          })
        ) {
          player.goUp();
        }
      }
      if (player.keys.has('A') || player.keys.has('ArrowLeft')) {
        if (
          !player.isAlive() ||
          !this.detectPlayerCollision(player, {
            x: -player.speed,
            y: 0,
          })
        ) {
          player.goLeft();
        }
      }
      if (player.keys.has('D') || player.keys.has('ArrowRight')) {
        if (
          !player.isAlive() ||
          !this.detectPlayerCollision(player, {
            x: player.speed,
            y: 0,
          })
        ) {
          player.goRight();
        }
      }
      if (player.keys.has('1')) {
        player.selectWeapon(0);
        this.getWeaponInfo(player);
      }
      if (player.keys.has('2')) {
        player.selectWeapon(1);
        this.getWeaponInfo(player);
      }
      if (player.keys.has('3')) {
        player.selectWeapon(2);
        this.getWeaponInfo(player);
      }
      if (player.keys.has('Shift')) {
        player.getAura();
      } else {
        player.removeAura();
      }
      if (player.keys.has('Escape')) {
        this.disconnectPlayer(player);
      }
    }
  }

  updatePlayerDirection(mouseCoordinates: MouseCoordinates) {
    const owner = this.getPlayer(mouseCoordinates.owner);
    if (owner) {
      const dx = mouseCoordinates.targetX - owner.x;
      const dy = mouseCoordinates.targetY - owner.y;
      owner.direction = Math.atan2(dy, dx) - 80;
    }
  }

  isPlayerAlive(id: string) {
    const player = this.getPlayer(id);
    if (player) {
      return this.getPlayer(id).isAlive();
    }
  }

  mouseClick(mouseClick: MouseCoordinates) {
    if (this.isPlayerAlive(mouseClick.owner)) {
      const shoot = this.shoot(mouseClick);
      if (shoot) {
        this.emitter.sendNewBullets(this.roomName, shoot.bullets);
        this.getWeaponInfo(shoot.owner);
      }
    } else {
      this.revivePlayer(mouseClick.owner);
    }
  }

  getWeaponInfo(player) {
    this.emitter.updateWeaponInfo(player.id, {
      selectedWeapon: player.selectedWeapon,
      weapons: player.weapons.map((weapon: Weapon) => ({ type: weapon.type, id: weapon.id })),
    });
  }

  private addWeapon(player, newWeapon) {
    const weapon = player.weapons.find(weapon => weapon.type === newWeapon.type);
    if (weapon) {
      const sumBullets = weapon.bulletsInMagazine + newWeapon.bulletsInMagazine;
      weapon.magazines +=
        newWeapon.magazines + Math.floor(sumBullets / weapon.maxBulletsInMagazine);
      weapon.bulletsInMagazine = sumBullets % weapon.maxBulletsInMagazine;
      if (weapon.bulletsInMagazine === 0) {
        weapon.reload();
      }
    } else {
      player.addWeapon(newWeapon);
    }
  }

  private detectPlayerCollisionWithGenerator(player: Player, direction?: Direction) {
    this.getItemGenerators().forEach(generator => {
      if (
        collisionDetector.detectCollision(player, generator, direction).yes &&
        generator.isReady()
      ) {
        generator.deactivate();
        setTimeout(() => {
          generator.activate();
          this.emitter.updateItemGenerator(this.roomName, new ItemGeneratorAPI(generator));
        }, generator.time);
        const weapon = generator.generateItem();
        this.addWeapon(player, weapon);
        this.getWeaponInfo(player);
        this.emitter.updateItemGenerator(this.roomName, new ItemGeneratorAPI(generator));
      }
    });
  }

  private detectPlayerCollision(player: Player, direction?: Direction) {
    this.detectPlayerCollisionWithGenerator(player, direction);
    return [
      ...this.getStaticObjects(),
      ...this.alivePlayers().filter(object => player !== object),
    ].some(object => collisionDetector.detectCollision(player, object, direction).yes);
  }
}
