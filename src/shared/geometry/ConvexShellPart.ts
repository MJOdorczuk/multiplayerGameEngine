import Vector2 from './Vector2';
import CircleShellPart from './CircleShellPart';
import IShellPart from './IShellPart';
import Circle from './Circle';

export default class ConvexShellPart implements IShellPart {

  get points(): Array<Vector2> {
    return this._points.map(point => point.copy());
  }

  set points(points: Array<Vector2>) {
    this._points = points;
    this.midPoint = this.points
      .reduce((sum, point) => sum.add(point), new Vector2(0, 0))
      .scale(1.0 / this.points.length);
    const n = points.length;
    this.succPointPairs = points
      .map((point, index) => [point, points[(index + 1) % n]]);
  }

  public constructor(points: Array<Vector2>) {
    this.points = points;
  }
  private _points: Array<Vector2>;
  private succPointPairs: Array<[Vector2, Vector2]>;
  private midPoint: Vector2;

  isInside(point: Vector2): boolean {
    let [left, right] = [0, 0];
    const clockwiseTriangle = (p1: Vector2, p2: Vector2, p3: Vector2) =>
      Math.sign(p3.subtract(p2).crossProduct(p2.subtract(p1)));
    this.succPointPairs
      .map(([p1, p2]) => clockwiseTriangle(p1, p2, point))
      .forEach(dir => {if (dir > 0) {left++; } if (dir < 0) {right++; }});
    return left * right === 0;
  }

  translate(translator: Vector2): void {
    this.points = this.points
      .map(point => point.add(translator));
  }

  rotate(anchor: Vector2, angle: number) {
    this.points = this.points
      .map(point => point
        .subtract(anchor)
        .rotate(angle)
        .add(anchor));
  }

  copy(): IShellPart {
    return new ConvexShellPart(this.points
      .map(point => point.copy()));
  }

  getHitCircle?(point: Vector2): Circle {
    return this.succPointPairs
      .filter(([p1, p2]) => {
        const v1 = p2.subtract(p1).crossProduct(point.subtract(p2));
        const v2 = this.midPoint.subtract(p2).crossProduct(point.subtract(this.midPoint));
        const v3 = p1.subtract(this.midPoint).crossProduct(point.subtract(p1));
        return (v1 >= 0 && v2 >= 0 && v3 >= 0) || (v1 <= 0 && v2 <= 0 && v3 <= 0);
      })
      .slice(0, 1)
      .map(([p1, p2]) => Circle
        .getHitCircleForWall(p1, p2, p2.subtract(p1).crossProduct(this.midPoint.subtract(p2)) > 0))
      [0];
  }
}
