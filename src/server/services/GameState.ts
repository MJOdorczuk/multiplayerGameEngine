import CollisionDetector from "./CollisionDetector";
import Bullet from "../models/Bullet";
import StaticRectangleObject from "../models/StaticRectangleObject";
import Player from "../models/Player";
import StaticCircularObject from "../models/StaticCircularObject";
import NewPlayer from "../../shared/api/NewPlayer";
import MouseCoordinates from "../../shared/api/MouseCoordinates";

export default class GameState {

    constructor(private staticObjects: any[] = [],
                private players: Player[] = [],
                private bullets: Bullet[] = []) {

        this.staticObjects.push(
            new StaticCircularObject(100, 200, 100, 'red'),
            new StaticCircularObject(1000, 200, 90, 'blue'),
            new StaticCircularObject(500, 400, 30, 'purple'),
            new StaticRectangleObject(500, 300, 0, 500, 100, 200, 'green', 45),
            new StaticRectangleObject(230, 170, 0, 200, 80, 80, 'blue', -30),
            new StaticRectangleObject(-400, -500, 0, 300, 300, 10, 'pink', -70),
            new StaticRectangleObject(1300, 30, 0, 100, 300, 100, 'yellow'),
        );
    }

    generateId() {
        return Date.now() + Math.floor(Math.random() * 100)
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
        return this.bullets.map(bullet => {
            return {id: bullet.id, x: bullet.x, y: bullet.y}
        });
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
        return [...this.staticObjects, ...this.players].some(object => {
            return player !== object && CollisionDetector.detectCollision(player, object, direction);
        });
    }

    detectBulletsCollision() {
        this.bullets.forEach((bullet, i) => {
            [...this.staticObjects, ...this.players].forEach(object => {
                if (bullet.owner !== object) {
                    if (CollisionDetector.detectCollision(object, bullet)) {
                        object.hitFromBullet(bullet);
                        this.bullets.splice(i, 1)
                    }
                    if (object.aura) {
                        if (CollisionDetector.detectCollision(object.aura, bullet)) {
                            bullet.decreaseSpeed();
                        } else {
                            bullet.increaseSpeed();
                        }
                    }
                }
            });
        });
    }

    addBullet(mouseClick: MouseCoordinates) {
        const owner = this.getPlayer(mouseClick.owner);
        if (owner) {
            const bullet = new Bullet(
                this.generateId(),
                owner,
                owner.x + owner.size / 4,
                owner.y + owner.size / 4,
                mouseClick.targetX,
                mouseClick.targetY,
                2
            );
            this.bullets.push(bullet);
            return {id: bullet.id, size: bullet.size};
        }
    }

    setPlayerActive(id: number) {
        this.getPlayer(id).active = true;
    }

    connectPlayer(id: number, newPlayer: NewPlayer) {
        const player = new Player(id, newPlayer.name, newPlayer.color, GameState.rand(1000), GameState.rand(1000), 20);
        this.players.push(player);
        return player;
    }

    disconnectPlayer(disconnected) {
        this.players.splice(this.players.indexOf(disconnected), 1);
    }

    setKeys(id, keys) {
        this.getPlayer(id).keys = new Set(keys);
    }

    move(id) {
        const player = this.getPlayer(id);
        if (player) {
            if (player.keys.has('W') || player.keys.has('ArrowUp')) {
                if (!this.detectPlayerCollision(player, {x: 0, y: player.speed})) {
                    player.goDown();
                }
            }
            if (player.keys.has('S') || player.keys.has('ArrowDown')) {
                if (!this.detectPlayerCollision(player, {x: 0, y: -player.speed})) {
                    player.goUp();
                }
            }
            if (player.keys.has('A') || player.keys.has('ArrowLeft')) {
                if (!this.detectPlayerCollision(player, {x: -player.speed, y: 0})) {
                    player.goLeft();
                }
            }
            if (player.keys.has('D') || player.keys.has('ArrowRight')) {
                if (!this.detectPlayerCollision(player, {x: player.speed, y: 0})) {
                    player.goRight();
                }
            }
            if (player.keys.has('Shift')) {
                player.getAura();
            }
            else {
                player.removeAura();
            }
        }
    }

    updatePlayerDirection(mouseCoordinates: MouseCoordinates) {
        const owner = this.getPlayer(mouseCoordinates.owner);
        if (owner) {
            const dx = mouseCoordinates.targetX - owner.x;
            const dy = mouseCoordinates.targetY - owner.y;
            owner.direction = Math.atan2(dy, dx) - 80;
        }
    }

    static rand(x) {
        return Math.floor((Math.random() * x) + 1);
    }
}