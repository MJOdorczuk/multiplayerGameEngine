import IUpdatable from '../interfaces/IUpdatable';
import ScreenModel from '../types/ScreenModel';
import Cursor from './Cursor';
import { SpotLight } from 'three';

interface Source {
  x: number;
  y: number;
}

export default class Light implements IUpdatable {
  private light: SpotLight;
  private source: Source;
  private dest: Cursor;

  constructor(public screen: ScreenModel) {}

  init(source: Source, cursor: Cursor, intensity = 20) {
    this.source = source;
    this.dest = cursor;
    this.light = new SpotLight(0xffffff, intensity, 700);
    this.update();
    this.light.castShadow = true;

    this.light.shadow.mapSize.width = 300;
    this.light.shadow.mapSize.height = 300;

    this.screen.scene.add(this.light);
  }

  remove() {
    this.screen.scene.remove(this.light);
  }

  update() {
    this.light.position.set(this.source.x, this.source.y, 50);
    if (this.dest) {
      this.light.target.position.set(this.dest.object.position.x, this.dest.object.position.y, 10);
      this.light.target.updateMatrixWorld(true);
    }
  }
}
