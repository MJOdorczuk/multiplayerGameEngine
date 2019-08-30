import Weapon from './Weapon';
import Bullet from '../Bullet';
import BulletData from '../../../shared/models/BulletData';

export default class Pistol extends Weapon {
  type = 'Pistol';
  magazines = 5;
  maxBulletsInMagazine = 10;
  bulletsInMagazine = 10;
  minTimeBetweenBullets = 200;
  reloadTime = 1500;
  shootBulletsCount = 1;
  bulletConfig = {
    size: 3,
    power: 10,
    range: 500,
  };

  constructor(params?: Partial<Pistol>) {
    super();
    Object.assign(this, params);
  }

  generateBullets(bulletData: BulletData) {
    return [
      new Bullet({
        owner: bulletData.owner,
        fromX: bulletData.fromX + bulletData.size / 4,
        fromY: bulletData.fromY + bulletData.size / 4,
        targetX: bulletData.targetX,
        targetY: bulletData.targetY,
        ...this.bulletConfig,
      }),
    ];
  }
}
