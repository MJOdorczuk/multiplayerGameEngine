import IShellPart from './IShellPart';
import Vector2 from './Vector2';
import Circle from './Circle';

export default class Shell implements IShellPart {
  shellParts: Array<IShellPart>;
  public constructor(shellParts: Array<IShellPart>) {
    this.shellParts = shellParts;
  }
  isInside(point: Vector2): boolean {
    return this.shellParts
      .some(part => part.isInside(point));
  }
  rotate(anchor: Vector2, angle: number): void {
    this.shellParts
      .forEach(part => part.rotate(anchor, angle));
  }
  translate(translator: Vector2): void {
    this.shellParts
      .forEach(part => part.translate(translator));
  }
  copy(): IShellPart {
    return new Shell(this.shellParts.map(part => part.copy()));
  }
  getHitCircle(point: Vector2): Circle {
    return this.shellParts
      .filter(part => part.isInside(point))
      [0]
      .getHitCircle(point);
  }
}
