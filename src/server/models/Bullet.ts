import BulletModel from '../../shared/models/BulletModel';
import { Angle } from '../services/CollisionDetector';
import Player from './Player';

export default class Bullet extends BulletModel {
  defaultSpeed = 10;
  minSpeed = 1;
  speed = 10;
  distance = 0;
  power = 10;
  range = 500;
  owner: any;
  fromX: number;
  fromY: number;
  targetX: number;
  targetY: number;
  active = true;
  reverseX = 1;
  reverseY = 1;
  vectorFT: number;
  dx: number;
  dy: number;
  customFlag = true;
  allowForManipulate = true;

  // gameName?: string;

  constructor(params: Partial<Bullet>) {
    super(params);
    Object.assign(this, params);
    this.x = this.fromX;
    this.y = this.fromY;
    this.vectorFT = Math.sqrt(
      Math.pow(this.targetX - this.fromX, 2) + Math.pow(this.targetY - this.fromY, 2),
    );
    this.dx = 0;
    this.dy = 0;
    Object.seal(this);
  }

  decreaseSpeedToMin(value: number = 2) {
    if (!this.isMinSpeed()) {
      if (this.speed > value) {
        this.speed -= value;
      } else {
        this.speed = this.minSpeed;
      }
    }
  }

  isDefaultSpeed(): boolean {
    return this.speed === this.defaultSpeed;
  }

  isMinSpeed(): boolean {
    return this.speed === this.minSpeed;
  }

  increaseSpeedToDefault(value: number = 1) {
    if (!this.isDefaultSpeed()) {
      if (this.defaultSpeed > this.speed + value) {
        this.speed += value;
      } else {
        this.speed = this.defaultSpeed;
      }
    }
  }

  isStillInAir(): boolean {
    return this.distance < this.range;
  }

  updatePosition() {
    this.additionalAction();
    this.distance += this.speed;
    this.dx = -(((this.fromX - this.targetX) * this.speed) / this.vectorFT) * this.reverseX;
    this.dy = -(((this.fromY - this.targetY) * this.speed) / this.vectorFT) * this.reverseY;
    this.x += this.dx;
    this.y += this.dy;
    if (!this.isStillInAir()) {
      this.deactivate();
    }
  }

  additionalAction() {
    if (this.customFlag) {
      this.increaseSpeedToDefault();
    }
  }

  effectOnPlayer(player: Player) {}

  hit(angle: Angle) {
    this.deactivate();
  }

  deactivate() {
    this.active = false;
  }

  isActive() {
    return this.active;
  }

  getAngle(): number {
    return Math.atan2(this.dy, this.dx);
  }
}
