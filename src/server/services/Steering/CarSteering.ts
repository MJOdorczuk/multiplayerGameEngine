import Steering from './Steering';
import { hasKeys } from '../../../shared/helpers';
import Direction from '../../../shared/models/Direction';
import Player from '../../models/Player';

export class CarSteering extends Steering {
  constructor(public allowForStaticRotate = true, public sensitivity = 0.05, public range = 200) {
    super();
  }
  performSteering(game, player: Player) {
    const up = hasKeys(player.keys, ['W', 'ArrowUp']);
    const down = hasKeys(player.keys, ['S', 'ArrowDown']);
    const left = hasKeys(player.keys, ['A', 'ArrowLeft']);
    const right = hasKeys(player.keys, ['D', 'ArrowRight']);
    const dir: Direction = {
      dx: 0,
      dy: 0,
    };
    let direction = player.bodyDirection;
    if (up && !down && !left && !right) {
      dir.dx = player.speed * Math.cos(player.bodyDirection);
      dir.dy = player.speed * Math.sin(player.bodyDirection);
    }
    if (!up && down && !left && !right) {
      dir.dx = -player.speed * Math.cos(player.bodyDirection);
      dir.dy = -player.speed * Math.sin(player.bodyDirection);
    }
    if (!up && !down && left && !right) {
      direction += this.sensitivity;
    }
    if (!up && !down && !left && right) {
      direction -= this.sensitivity;
    }
    if (up && !down && left && !right) {
      direction += this.sensitivity;
      dir.dx = player.speed * Math.cos(player.bodyDirection);
      dir.dy = player.speed * Math.sin(player.bodyDirection);
    }
    if (up && !down && !left && right) {
      direction -= this.sensitivity;
      dir.dx = player.speed * Math.cos(player.bodyDirection);
      dir.dy = player.speed * Math.sin(player.bodyDirection);
    }
    if (!up && down && left && !right) {
      direction += this.sensitivity;
      dir.dx = -player.speed * Math.cos(player.bodyDirection);
      dir.dy = -player.speed * Math.sin(player.bodyDirection);
    }
    if (!up && down && !left && right) {
      direction -= this.sensitivity;
      dir.dx = -player.speed * Math.cos(player.bodyDirection);
      dir.dy = -player.speed * Math.sin(player.bodyDirection);
    }

    if (
      !player.isAlive() ||
      (!game.detectPlayerCollision(player, dir) && (dir.dx !== 0 || dir.dy !== 0))
    ) {
      player.go(dir);
      this.updateCursor(player, direction);
    } else {
      player.go({ dx: 0, dy: 0 });
      if (this.allowForStaticRotate) {
        this.updateCursor(player, direction);
      }
    }
  }

  private updateCursor(owner: Player, direction: number) {
    owner.bodyDirection = direction;
    owner.cursor.x = owner.x + this.range * Math.cos(owner.bodyDirection);
    owner.cursor.y = owner.y + this.range * Math.sin(owner.bodyDirection);
  }
}

const carSteering = new CarSteering();
export default carSteering;
