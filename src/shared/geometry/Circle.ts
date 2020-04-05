import Vector2 from './Vector2';

export default class Circle {
  public constructor(position: Vector2, radius: number) {
    this.position = position;
    this.radius = radius;
  }
  private static HITBOX_RADIUS_FACTOR: number = 1000.0;
  position: Vector2;
  radius: number;
  static getHitCircleForWall(p1: Vector2, p2: Vector2, left: boolean) {
    return new Circle(p2
      .subtract(p1)
      .scale(0.5)
      .add(p1)
      .add(left
        ? p2.subtract(p1).rotate90left().scale(this.HITBOX_RADIUS_FACTOR)
        : p2.subtract(p1).rotate90right().scale(this.HITBOX_RADIUS_FACTOR)),
      Math.sqrt(p2.subtract(p1).lengthSquared()) * this.HITBOX_RADIUS_FACTOR);
  }
  deflect(point: Vector2, velocity: Vector2): Vector2 {
    return point
      .subtract(this.position)
      .normalize()
      .project(velocity)
      .scale(velocity.dotProduct(point.subtract(this.position)) < 0 ? -1 : 0);
  }
}
