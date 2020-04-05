import Vector2 from '../geometry/Vector2';
import Circle from './Circle';

export default interface IShellPart {
  isInside(point: Vector2): boolean;
  translate(translator: Vector2): void;
  rotate(anchor: Vector2, angle: number): void;
  copy(): IShellPart;
  getHitCircle(point: Vector2): Circle;
}
