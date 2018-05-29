import CollisionDetector from "./CollisionDetector";
import Bullet from "../models/Bullet";
import StaticRectangleObject from "../models/StaticRectangleObject";
import Player from "../models/Player";
import StaticCircularObject from "../models/StaticCircularObject";
import NewPlayer from "../../shared/api/NewPlayer";
import NewBullet from "../../shared/api/NewBullet";

export default class GameState {

    constructor(private staticObjects: any[] = [],
                private players: Player[] = [],
                private bullets: Bullet[] = []) {

        this.staticObjects.push(
            new StaticCircularObject(100, 200, 100, 'red'),
            new StaticCircularObject(1000, 200, 90, 'blue'),
            new StaticCircularObject(500, 400, 30, 'purple'),
            new StaticRectangleObject(500, 300, 500, 100, 'green', 45),
            new StaticRectangleObject(230, 170, 200, 80, 'aqua', -30),
            new StaticRectangleObject(2300, 30, 100, 300, 'yellow'),
        );
    }

    getPlayer(id) {
        return this.players.find(player => player.id === id);
    }

    activePlayers() {
        return this.players.filter(player => player.active === true)
    }

    getPlayers() {
        return this.players;
    }

    getBullets() {
        return this.bullets;
    }

    getStaticObjects() {
        return this.staticObjects;
    }

    updateBullets() {
        this.bullets.forEach((bullet, i) => {
            bullet.update();
            if (!bullet.isStillInAir()) {
                this.bullets.splice(i, 1)
            }
        });
    }

    detectPlayerCollision(player, direction: { x: number, y: number }) {
        return [].concat(this.staticObjects)
            .concat(this.players)
            .some(object => {
                return player !== object && CollisionDetector.detectCollision(player, object, direction);
            });
    }

    detectBulletsCollision() {
        this.bullets.forEach((bullet, i) => {
            [].concat(this.staticObjects)
                .concat(this.players)
                .forEach(object => {
                    if (bullet.owner !== object && CollisionDetector.detectCollision(object, bullet)) {
                        object.hitFromBullet(bullet);
                        this.bullets.splice(i, 1)
                    }
                });
        });
    }

    addBullet(newBullet: NewBullet) {
        const owner = this.getPlayer(newBullet.owner);
        const bullet = new Bullet(
            owner.x + owner.size / 4,
            owner.y + owner.size / 4,
            newBullet.targetX,
            newBullet.targetY,
            owner
        );
        this.bullets.push(bullet);
    }

    setPlayerActive(id: number) {
        this.getPlayer(id).active = true;
    }

    connectPlayer(id: number, newPlayer: NewPlayer) {
        const player = new Player(id, newPlayer.name, newPlayer.color, GameState.rand(1000), GameState.rand(1000), 20);
        this.players.push(player);
    }

    disconnectPlayer(disconnected) {
        this.players.splice(this.players.indexOf(disconnected), 1);
    }

    setKeys(id, keys) {
        this.getPlayer(id).keys = new Set(keys);
    }

    move(id) {
        const player = this.getPlayer(id);
        if (player.keys.has('w') || player.keys.has('W') || player.keys.has('ArrowUp')) {
            if (!this.detectPlayerCollision(player, {x: 0, y: -player.speed})) {
                player.goUp();
            }
        }
        if (player.keys.has('s') || player.keys.has('S') || player.keys.has('ArrowDown')) {
            if (!this.detectPlayerCollision(player, {x: 0, y: player.speed})) {
                player.goDown();
            }
        }
        if (player.keys.has('a') || player.keys.has('A') || player.keys.has('ArrowLeft')) {
            if (!this.detectPlayerCollision(player, {x: -player.speed, y: 0})) {
                player.goLeft();
            }
        }
        if (player.keys.has('d') || player.keys.has('D') || player.keys.has('ArrowRight')) {
            if (!this.detectPlayerCollision(player, {x: player.speed, y: 0})) {
                player.goRight();
            }
        }
    }

    static rand(x) {
        return Math.floor((Math.random() * x) + 1);
    }
}