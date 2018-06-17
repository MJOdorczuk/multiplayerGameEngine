import NewPlayer from "../../../shared/api/NewPlayer";
import Player from "../../../server/models/Player";
import Cursor from '../../models/Cursor';
import Map from '../../models/Map';
import Loop from '../../Loop'
import Menu from "../../models/Menu";
const THREE = require('three');

const io = require('socket.io-client');
const startImageJPG = require("./obrazki/start.jpg");
const mapJPG = require("./obrazki/test.jpg");
const cursorPNG = require("./obrazki/celownik.png");

let url = process.env.API_URL || 'localhost';
url = 'http://' + url.toString() + ':3000';
const socket = io.connect(url);

console.log('Connected with: ' + url);

window.onload = function () {
    // const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    // canvas.style.cursor = "none";
    // const ctx = canvas.getContext('2d');
    // const screen = {ctx: ctx, canvas: canvas};

    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.01,
        2000);
    camera.position.z = 400;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const screen = {
        camera : camera, scene: scene, renderer: renderer
    };

    const map = new Map(mapJPG);
    const menu = new Menu(startImageJPG, screen);
    const cursor = new Cursor(cursorPNG);
        //
    // var geometry, material, mesh;
    // geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // material = new THREE.MeshNormalMaterial();
    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    function randRGB() {
        return Math.floor(Math.random() * 255);
    }

    function randColor() {
        return `rgb(${randRGB()},${randRGB()},${randRGB()})`;
    }

    function registerUser(data) {
        let name = prompt("Please enter your name", "Player");
        if (!(name === null || name === '')) {
            const newPlayer = new NewPlayer(data.socketId, name, randColor());
            socket.emit('CreatePlayer', newPlayer);
            return newPlayer;
        } else {
            registerUser(data)
        }
    }

    socket.on('HelloPlayer', function (data) {
        console.log(data);
        const newPlayer = registerUser(data);
        alert(newPlayer.name + ' joined the game!');
        const loop = new Loop(socket, newPlayer, screen, cursor, menu, map);
        loop.run();
    });

};