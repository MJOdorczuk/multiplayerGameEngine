export default class Vector2 {
  x: number;
  y: number;
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  scale(k: number): Vector2 {
    return new Vector2(this.x * k, this.y * k);
  }
  reverse(): Vector2 {
    return new Vector2(- this.x, - this.y);
  }
  angle(): number {
    return Math.sign(this.y) * Math.atan(this.y / this.x);
  }
  project(v: Vector2): Vector2 {
    return new Vector2(this.x * v.x, this.y * v.y);
  }
  dotProduct(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }
  lengthSquared(): number {
    return this.dotProduct(this);
  }
  normalize(): Vector2 {
    return this.scale(1.0 / this.lengthSquared());
  }
  crossProduct(v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }
  complexProduct(v: Vector2): Vector2 {
    return new Vector2(this.x * v.x - this.y * v.y, this.x * v.y + this.y * v.x);
  }
  rotate(angle: number): Vector2 {
    return new Vector2(Math.cos(angle), Math.sin(angle)).complexProduct(this);
  }
  rotate90left(): Vector2 {
    return new Vector2(- this.y, this.x);
  }
  rotate90right(): Vector2 {
    return new Vector2(this.y, - this.x);
  }
  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
