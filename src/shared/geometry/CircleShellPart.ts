import Vector2 from './Vector2';
import IShellPart from './IShellPart';
import Circle from './Circle';

export default class CircleShellPart implements IShellPart {
  get position(): Vector2 {
    return this._circle.position;
  }

  set position(value: Vector2) {
    this._circle.position = value;
  }

  get radius(): number {
    return this._circle.radius;
  }

  set radius(value: number) {
    this._circle.radius = value;
  }

  public constructor(position: Vector2, radius: number) {
    this._circle = new Circle(position, radius);
  }
  private _circle: Circle;
  rotate(anchor: Vector2, angle: number): void {
    this.position = this.position
      .subtract(anchor)
      .rotate(angle)
      .add(anchor);
  }

  translate(translator: Vector2): void {
    this.position = this.position
      .add(translator);
  }

  isInside(point: Vector2): boolean {
    return this.position
      .subtract(point)
      .lengthSquared() <= this.radius * this.radius;
  }

  copy(): IShellPart {
    return new CircleShellPart(this.position.copy(), this.radius);
  }

  getHitCircle(point: Vector2): Circle {
    return this._circle;
  }
}
