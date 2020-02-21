import Phaser from "phaser";
import logoImg from "./assets/logo.png";
//import tile1 from './assets/bricks/tile1.png';
import {randomNumber} from './include.js';

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

let brick;
let ground;
let stack;

function preload() {
  //this.load.image("logo", logoImg);
  //this.load.image('tile1', tile1);
  this.load.image('tile1', './src/assets/bricks/tile1.png');
  this.load.image('tile2', './src/assets/bricks/tile2.png');
  this.load.image('tile3', './src/assets/bricks/tile3.png');
  this.load.image('tile4', './src/assets/bricks/tile4.png');
  this.load.image('tile5', './src/assets/bricks/tile5.png');
  this.load.image('ground', './src/assets/platform.png');
}

function create() {
  //const logo = this.add.image(400, 150, "logo");

  //const logo = this.add.image(400, 150, "tile1");


  const cursors = this.input.keyboard.createCursorKeys();
  brick = this.physics.add.group();
  brick.setVelocityY(1,0);
  brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
  brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));

  //Add the floor
  //ground = this.physics.add.sprite(300,this.game.config.height / 2 - 100, 'ground');
  ground = this.physics.add.staticGroup();
  ground.create(300,500, 'ground');
  //ground.body.setAllowGravity(false);
  this.physics.add.collider(brick, ground, tileHitsGroundOrBlock,null,this);

  stack = this.physics.add.staticGroup();
  //brick.children.entries.forEach(child => stack.create(child.body.x, child.body.y+100,child.texture));
  console.log(stack);
  /*
  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });*/
}

function tileHitsGroundOrBlock() {
  var children = brick.children;
  children.entries.forEach(child => stack.create(child.body.x, child.body.y,child.texture));
  //var children = brick.getChildren();
  brick.clear();

  console.log(children);
  //Add to stack
  //children.entries.forEach(child => stack.add(child));
  //children.entries.forEach(child => console.log(child));
  //stack.create(300,100, 'ground');

  brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
  brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));
  //ground.body.setAllowGravity(false);
  //ground.setVelocityY(0);
  console.log(stack);
}
