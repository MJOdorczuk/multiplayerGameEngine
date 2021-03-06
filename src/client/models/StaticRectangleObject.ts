import StaticRectangleObjectModel from '../../shared/models/StaticRectangleObjectModel';
import IUpdatable from '../interfaces/IUpdatable';
import ScreenModel from '../interfaces/ScreenModel';
import { BoxGeometry, Math, Mesh, MeshPhongMaterial, TextureLoader } from 'three';

const box = require('../games/balls/images/box.png');

export default class StaticRectangleObject extends StaticRectangleObjectModel
  implements IUpdatable {
  private object: Mesh;

  init(screen: ScreenModel) {
    const texture = new TextureLoader().load(box);
    const geometry = new BoxGeometry(this.width, this.height, this.depth);
    const material = new MeshPhongMaterial({
      map: texture,
      color: this.color,
    });
    this.object = new Mesh(geometry, material);

    this.object.rotation.z = Math.degToRad(this.deg);

    this.object.position.x = this.x + this.width / 2;
    this.object.position.y = this.y + this.height / 2;
    this.object.position.z = this.z + this.depth / 2;

    this.object.castShadow = true;
    this.object.receiveShadow = true;
    screen.scene.add(this.object);
  }

  update() {}
}
