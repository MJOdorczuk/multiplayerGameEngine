import Power from '../../../shared/models/Power';
import Player from '../Player';

export default class AIM extends Power {
  type = 'AIM';
  cost = 0.3;

  constructor(params?: Partial<AIM>) {
    super();
    Object.assign(this, params);
    Object.seal(this);
  }

  isActive(): boolean {
    return this.active;
  }

  use({ owner, game }: { owner: Player; game }) {
    this.active = true;
    this.effect({ owner, game });
  }

  release({ owner }: { owner: Player }) {
    this.active = false;
  }

  effect({ owner, game }: { owner: Player; game }): boolean {
    if (this.isActive() && owner.tryUseEnergy(this.cost)) {
      const closestPlayer = game.trackClosestPlayer(owner);
      if (closestPlayer) {
        owner.updateCursor(closestPlayer);
        owner.updateDirection();
      }
    } else {
      return false;
    }
  }
}
