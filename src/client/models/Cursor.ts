import IRenderable from "../interfaces/IRenderable";
import {Screen} from "../types/Screen";
const THREE = require('three');

export default class Cursor implements IRenderable {

    public x: number;
    public y: number;
    // public img: HTMLImageElement;
    // private img;
    public img;

    constructor(public src: string) {
        // this.img = new Image();
        // this.img.src = src;


        // this.img.material.depthTest = false;
        // this.img.material.depthWrite = false;
    };

    init(screen: Screen) {
        this.img = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30, 0),
            new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load(this.src)
            })
        );
        screen.scene.add(this.img);
    }

    render() {
        this.img.position.x = this.x;
        this.img.position.y = this.y;
        // this.screen.ctx.drawImage(
        //     this.img,
        //     this.x - this.img.width / 2,
        //     this.y - this.img.height / 2
        // );
    }
}