import Player from '../Player';
import Bullet from '../Bullet';
import collisionDetector from '../../services/CollisionDetector';
import Direction from '../../../shared/models/Direction';
import SlowBullets from './SlowBullets';

export default class ReverseBullets extends SlowBullets {
  type = 'ReverseBullets';
  cost = 0.03;

  constructor(params?: Partial<SlowBullets>) {
    super(params);
  }

  effect({
    bullet,
    bulletDirection,
    owner,
  }: {
    bullet: Bullet;
    bulletDirection: Direction;
    owner: Player;
  }): boolean {
    const cost = this.cost * bullet.power;
    if (
      this.isActive() &&
      bullet.power > 0 &&
      owner.hasEnoughEnergy(cost) &&
      collisionDetector.detectCollision(
        bullet,
        { shape: 'circle', size: this.size, x: owner.x, y: owner.y },
        bulletDirection,
      ).yes
    ) {
      owner.useEnergy(cost);
      bullet.customFlag = false;
      bullet.decreaseSpeedToMin(0.3);
      if (bullet.isMinSpeed()) {
        bullet.customFlag = true;
        bullet.owner = owner;
        bullet.distance = 10;
        bullet.reverseX *= -1;
        bullet.reverseY *= -1;
      }
      return true;
    } else {
      bullet.customFlag = true;
      return false;
    }
  }
}
