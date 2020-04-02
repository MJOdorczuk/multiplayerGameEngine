export default class Vector2 {
  x: number;
  y: number;
  protected constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  scale(k: number): Vector2 {
    return new Vector2(this.x * k, this.y * k);
  }
  reverse(): Vector2 {
    return new Vector2(- this.x, - this.y);
  }
  length(): number {
    return this.x * this.x + this.y * this.y;
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
}
