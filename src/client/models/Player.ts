import PlayerModel from "../../shared/models/PlayerModel";
import IRenderable from "../interfaces/IRenderable";
import {Screen} from "../types/Screen";
const THREE = require('three');
const cumin = require("../games/balls/images/head.png");
const texture = new THREE.TextureLoader().load(cumin);

export default class Player extends PlayerModel implements IRenderable {

    public object;
    private initiated = false;
    private screen;

    init(screen: Screen) {
        this.screen = screen;
        if(!this.isInitiated()) {
            const texture = new THREE.TextureLoader().load(cumin);
            const geometry = new THREE.SphereGeometry(20 ,10, 10, 1);
            const material = new THREE.MeshPhongMaterial({map: texture, color: this.color});
            this.object = new THREE.Mesh(geometry, material);
            this.object.receiveShadow = true;
            this.screen.scene.add(this.object);
            this.initiated = true;
        }
    }

    isInitiated() {
        return this.initiated;
    }

    setAsActive() {
        this.object.castShadow = false;
    }

    setAsEnemy() {
        this.object.castShadow = true;
    }

    renderBody() {
        this.object.rotation.z = this.direction;
        this.object.position.x = this.x;
        this.object.position.y = this.y;
    }

    render() {
        this.renderBody();
        if(this.active === false) {
            this.remove()
        }
    }

    remove() {
        this.screen.scene.remove(this.object)
    }

}
