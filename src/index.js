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
        gravity: { y: 300, x:1 },
        debug: false
    }
  },
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let brick;
let ground;
let stack;
let cursors;
let touched = false;

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
  //console.log(this.physics.overlap(brick,stack));
  //const logo = this.add.image(400, 150, "logo");

  //const logo = this.add.image(400, 150, "tile1");


  cursors = this.input.keyboard.createCursorKeys();
  brick = this.physics.add.group();
  brick.setVelocityY(80);
  brick.setVelocityX(0);
  brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
  brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));
  //brick.children.each(child => child.body.blocked.left=true);
  //Add the floor
  //ground = this.physics.add.sprite(300,this.game.config.height / 2 - 100, 'ground');
  ground = this.physics.add.staticGroup();
  ground.create(300,500, 'ground');
  //ground.body.setAllowGravity(false);
  this.physics.add.collider(brick, ground, tileHitsGroundOrBlock,null,this);

  stack = this.physics.add.staticGroup();
  //brick.children.entries.forEach(child => stack.create(child.body.x, child.body.y+100,child.texture));
  this.physics.add.collider(brick, stack, tileHitsGroundOrBlock,null,this);
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


function update() {
  //console.log(this.physics.overlap(brick, stack));
  // Configure the controls!
  //Without gravity
  //brick.children.entries.forEach(child => child.body.y += 6);
  if (!cursors.down.isDown) {
    touched = false;
    //brick.children.forEach(child => child.setVelocityY(80));
    brick.setVelocityY(80);
    if(cursors.left.isDown && !touched) {
      //brick.setVelocityX(-60);
      brick.children.entries.forEach(child => child.body.x -= 61);
      touched = true;
    } else if (cursors.right.isDown) {
      //brick.setVelocityX(60);
      brick.children.entries.forEach(child => child.body.x += 61);
      touched = true;
    } else {
      brick.setVelocityX(0);
    }
  } else {
    //brick.children.forEach(child => child.setVelocityY(300));
    brick.setVelocityY(300);
  }
}

function tileHitsGroundOrBlock() {
  //console.log(brick);
  brick.children.each(child => console.log(child.body.overlapY));
  //console.log(brick.children.entries.filter(child => child.body.touching));
  //brick.children.each(child => console.log(child.body));
  var children = brick.getChildren();
  var topofstack = brick.children.entries.filter(child => child.body.y < 60);
  //children.entries.forEach(child => console.log(child.body.y));
  //children.entries.forEach(child => stack.add(child));
  //children.entries.forEach(child => stack.create(child.body.x, child.body.y,child.texture));
  /*
  for(var i=0;i<children.length;i++) {
    //children[i].destroy();
    brick.remove(children[i],true,true);
  }*/
  brick.children.each(child => stack.create(child.body.x + 30, child.body.y+ 30,child.texture));
  brick.children.each(child => child.destroy());
  //var children = brick.getChildren();
  brick.clear();
  if(topofstack.length == 0) {
    //Add to stack
    //children.entries.forEach(child => stack.add(child));
    //children.entries.forEach(child => console.log(child));
    //stack.create(300,100, 'ground');
    //let brick = this.physics.add.group();
    brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
    brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));
    console.log("Here");
    //ground.body.setAllowGravity(false);
    //ground.setVelocityY(0);
  }
  //brick.children.each(child => child.body.blocked.left=true);
  //console.log(stack);
}
