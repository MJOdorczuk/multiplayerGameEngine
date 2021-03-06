import Weapon from './Weapon';
import Bullet from '../Bullet';
import BulletData from '../../../shared/models/BulletData';

export default class Resizer extends Weapon {
  type = 'Resizer';
  magazines = 3;
  maxBulletsInMagazine = 10;
  bulletsInMagazine = 10;
  minTimeBetweenBullets = 100;
  reloadTime = 1000;
  shootBulletsCount = 1;
  bulletConfig = {
    color: 'white',
    size: 5,
    power: 1,
    range: 700,
    effectOnPlayer(player) {
      player.size += 2;
      if (player.speed > 0.5) {
        player.speed -= 0.5;
      }
    },
    additionalAction() {
      this.size += 0.1;
      if (this.customFlag) {
        this.increaseSpeedToDefault();
      }
    },
  };

  constructor(params?: Partial<Resizer>) {
    super();
    Object.assign(this, params);
  }

  prepareBullets(bulletData: BulletData) {
    return [
      new Bullet({
        owner: bulletData.owner,
        fromX: bulletData.fromX,
        fromY: bulletData.fromY,
        targetX: bulletData.targetX,
        targetY: bulletData.targetY,
        ...this.bulletConfig,
      }),
    ];
  }
}
