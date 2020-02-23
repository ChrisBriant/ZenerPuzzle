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
let touchcount=0;

//Control variables - make local once tested
let bottomrow;
let lineoffour;

function preload() {
  //this.load.image("logo", logoImg);
  //this.load.image('tile1', tile1);
  this.load.image('tile1', './src/assets/bricks/tile1.png');
  this.load.image('tile2', './src/assets/bricks/tile2.png');
  this.load.image('tile3', './src/assets/bricks/tile3.png');
  this.load.image('tile4', './src/assets/bricks/tile4.png');
  this.load.image('tile5', './src/assets/bricks/tile5.png');
  this.load.image('ground', './src/assets/platform.png');
  this.load.image('block30x30', './src/assets/bricks/block30x30.png');
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
  //ground.create(300,500, 'ground');
  var floor = this.add.tileSprite(400, 585, 800, 30, "block30x30");
  ground.add(floor);
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


/*
function checkInsideSprite(x,y,sprite) {
  if(sprite.body.left < x && sprite.body.right > x && sprite.body.top < y && sprite.body.bottom > y) {
    return true;
  } else {
    return false;
  }
}*/

function checkLineofFourX(spritearray) {
  var matchcount = 0;
  var matches = [];

  for(var i = 0; i < spritearray.length; i++) {
    if(i + 1 < spritearray.length) {
      //Check next sprite is adjacent
      if(spritearray[i+1].body.x < spritearray[i].body.x + 65 && spritearray[i+1].body.x > spritearray[i].body.x + 55) {
        //Check texture is the same
        if(spritearray[i+1].texture.key === spritearray[i].texture.key) {
            matchcount++;
        } else {
          matchcount = 0;
        }
      } else {
        matchcount = 0;
      }
      //Match is found
      if(matchcount >= 3) {
        matches.push(spritearray[i].texture.key);
        matchcount = 0;
      }
    }
  }
  return matches;
}


function checkLineofFourY(spritearray) {
  var matchcount = 0;
  var matches = [];

  for(var i = 0; i < spritearray.length; i++) {
    if(i + 1 < spritearray.length) {
      //Check next sprite is adjacent
      if(spritearray[i+1].body.y < spritearray[i].body.y + 65 && spritearray[i+1].body.y > spritearray[i].body.y + 55) {
        //Check texture is the same
        if(spritearray[i+1].texture.key === spritearray[i].texture.key) {
            matchcount++;
        } else {
          matchcount = 0;
        }
      } else {
        matchcount = 0;
      }
      //Match is found
      if(matchcount >= 3) {
        matches.push(spritearray[i].texture.key);
        matchcount = 0;
      }
    }
  }
  return matches;
}

function update() {
  //Detect line creation
  //HORIZONTAL LINES
  //Iterate through each row
  var lines = [];
  for (var i = 520; i > 70; i-= 60) {
    //Get row and sort
    var row = stack.children.entries.filter(child => child.body.y < i && child.body.y > i - 15 );
    row.sort(function(a, b){return a.body.x - b.body.x});
    lineoffour = checkLineofFourX(row); //Check matches
    if(lineoffour.length > 0) {
      lines.push(lineoffour);
      //console.log(lineoffour);
    }
  }
  //VERTICAL LINES
  //Iterate through each column
  for (var i = 0; i < 840; i+= 60) {
    //Get row and sort
    var col = stack.children.entries.filter(child => child.body.x < i + 15 && child.body.x > i );
    col.sort(function(a, b){return a.body.y - b.body.y});
    lineoffour = checkLineofFourY(col); //Check matches
    if(lineoffour.length > 0) {
      lines.push(lineoffour);
      //console.log(lineoffour);
    }
  }

  //console.log(lines);

  // Configure the controls!
  if (!cursors.down.isDown) {
    if(touchcount > 0) {
      touchcount -= 1;
    }
    touched = false;
    //brick.children.forEach(child => child.setVelocityY(80));
    brick.setVelocityY(80);
    //// REVIEW: Line nleow not sure if the "!this.pysics.overlap" is needed
    if(cursors.left.isDown && touchcount == 0 && !this.physics.overlap(brick,stack)) {
      //Add a blank sprite to the left and check collides with stack
      var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y + 30);
      if(!this.physics.overlap(checksprite, stack)) {
        brick.children.entries.forEach(child => child.body.x -= 61);
      }
      checksprite.destroy();
      touched = true;
      touchcount = 10;
    } else if (cursors.right.isDown && touchcount == 0) {
      //Add a blank sprite to the left and check collides with stack
      var checksprite = this.physics.add.sprite(brick.children.entries[1].body.x + 60,brick.children.entries[0].body.y + 30);
      if(!this.physics.overlap(checksprite, stack)) {
        brick.children.entries.forEach(child => child.body.x += 61);
      }
      checksprite.destroy();
      touched = true;
      touchcount = 10;
    } else if (cursors.space.isDown && touchcount == 0) {
      //Handle rotation
      if(brick.children.entries[1].body.x > brick.children.entries[0].body.x + 5 && brick.children.entries[1].body.x > brick.children.entries[0].body.x - 5) {
        //Brick is horrizontally alligned so move to vertical orientation
        console.log("Horizontal");
        brick.children.entries[0].body.x += 60;
        brick.children.entries[0].body.y -= 60;
      } else {
        //Brick is orientated vertically so rotate to horizontal position
        brick.children.entries[0].body.x += 60;
        brick.children.entries[0].body.y += 60;
      }
      touched = true;
      touchcount = 10;
    } else {
      brick.setVelocityX(0);
    }
  } else {
    //brick.children.forEach(child => child.setVelocityY(300));
    brick.setVelocityY(300);
  }
}

function tileHitsGroundOrBlock() {
  //console.log(bottomrow);
  //lineoffour = checkLineofFour(bottomrow);
  //console.log(lineoffour);

  //console.log(brick);
  //brick.children.each(child => console.log(child.body.overlapY));
  //console.log(brick.children.entries.filter(child => child.body.touching));
  //brick.children.each(child => console.log(child.body));
  //var children = brick.getChildren();
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
    //console.log("Here");
    //ground.body.setAllowGravity(false);
    //ground.setVelocityY(0);
  } else {
    console.log(bottomrow);
  }
  //brick.children.each(child => child.body.blocked.left=true);
  console.log(stack);
}
