import Phaser from "phaser";
import logoImg from "./assets/logo.png";
//import tile1 from './assets/bricks/tile1.png';
import {randomNumber} from './include.js';

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
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
let flashingtiles = [];
let flashing = false;

//Control variables - make local once tested
let bottomrow;
let lineoffour;
//let lines = [];

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
  brick = this.add.group();
  brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
  brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));
  //brick.children.each(child => child.body.blocked.left=true);
  //Add the floor
  //ground = this.physics.add.sprite(300,this.game.config.height / 2 - 100, 'ground');
  ground = this.add.group();
  //ground.create(300,500, 'ground');
  var floor = this.add.tileSprite(400, 585, 800, 30, "block30x30");
  ground.add(floor);
  //ground.body.setAllowGravity(false);
  //this.add.collider(brick, ground, tileHitsGroundOrBlock,null,this);

  stack = this.add.group();
  //brick.children.entries.forEach(child => stack.create(child.body.x, child.body.y+100,child.texture));
  //this.add.collider(brick, stack, tileHitsGroundOrBlock,null,this);

  console.log(brick);

}


function checkOverlap(groupA, groupB) {
    for ()
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}


function consolidateTilesX(tiles) {
  if(tiles.length > 0) {
    var block = [];

    for(var i=0;i<tiles.length;i++) {
      for(var j=0;j<tiles[i].matchedtiles.length;j++) {
        block.push(tiles[i].matchedtiles[j].matchx);
      }
    }

    console.log("finished consolodation");
    console.log(block);
    var blockunique = Array.from(new Set(block));
    var blockuniquewithy = [];
    for(var i = 0;i<blockunique.length;i++) {
      console.log(i);
      blockuniquewithy.push({matchx:blockunique[i],matchy:tiles[0].matchedtiles[0].matchy});
    }
    var newmatches = [];
    newmatches.push({texture:tiles[0].texture,matchedtiles:blockuniquewithy,type:'H'});
    return newmatches;
  } else {
    return [];
  }
}


function consolidateTilesY(tiles) {
  if(tiles.length > 0) {
    var block = [];

    for(var i=0;i<tiles.length;i++) {
      for(var j=0;j<tiles[i].matchedtiles.length;j++) {
        block.push(tiles[i].matchedtiles[j].matchy);
      }
    }
    var blockunique = Array.from(new Set(block));
    var blockuniquewithy = [];
    for(var i = 0;i<blockunique.length;i++) {
      blockuniquewithy.push({matchx:tiles[0].matchedtiles[0].matchy,matchy:blockunique[i]});
    }
    var newmatches = [];
    newmatches.push({texture:tiles[0].texture,matchedtiles:blockuniquewithy,type:'V'});
    return newmatches;
  } else {
    return [];
  }
}

function checkLineofFourX(spritearray) {
  var matchcount = 0;
  var matchedtiles = [];
  var matches = [];

  for(var i = 0; i < spritearray.length; i++) {
    if(i + 1 < spritearray.length) {
      //Check next sprite is adjacent
      if(spritearray[i+1].body.x < spritearray[i].body.x + 65 && spritearray[i+1].body.x > spritearray[i].body.x + 55) {
        //Check texture is the same
        if(spritearray[i+1].texture.key === spritearray[i].texture.key) {
            matchcount++;
            matchedtiles.push({matchx:spritearray[i].body.x,matchy:spritearray[i].body.y});
        } else {
          matchcount = 0;
          matchedtiles = [];
        }
      } else {
        matchcount = 0;
        matchedtiles = [];
      }
      //Match is found
      if(matchcount >= 3) {
        var matchingrow = [...matchedtiles];
        matchingrow.push({matchx:spritearray[i+1].body.x,matchy:spritearray[i+1].body.y});
        matches.push({texture:spritearray[i].texture.key,matchedtiles:matchingrow,matchcount:matchcount,type:'V'});
      }
    }
  }
  var consolodatedtiles = consolidateTilesX(matches);
  return consolodatedtiles;
}


function checkLineofFourY(spritearray) {
  var matchcount = 0;
  var matchedtiles = [];
  var matches = [];
  var matched = false;

  for(var i = 0; i < spritearray.length; i++) {

    if(i + 1 < spritearray.length) {
      //Check next sprite is adjacent
      if(spritearray[i+1].body.y < spritearray[i].body.y + 65 && spritearray[i+1].body.y > spritearray[i].body.y + 55) {
        //Check texture is the same
        if(spritearray[i+1].texture.key === spritearray[i].texture.key) {
            matchcount++;
            matchedtiles.push({matchx:spritearray[i].body.x,matchy:spritearray[i].body.y});
        } else {
          matchcount = 0;
          matchedtiles = [];
        }
      } else {
        matchcount = 0;
        matchedtiles = [];
      }
      //Match is found
      if(matchcount >= 3) {
        var matchingrow = [...matchedtiles];
        matchingrow.push({matchx:spritearray[i+1].body.x,matchy:spritearray[i+1].body.y});
        matches.push({texture:spritearray[i].texture.key,matchedtiles:matchingrow,matchcount:matchcount,type:'V'});
      }
    }
  }
  if(matches.length > 0) {
    console.log(matches);
    alert("Match");
  }
  var consolodatedtiles = consolidateTilesY(matches);
  return consolodatedtiles;
}


//Remove the flashing graphics
function destroyFlashingTile(x,y) {
  var destroytile = flashingtiles.filter(child => child.x == x && child.y == y);
  destroytile[0].destroy();
}

//Sort the stack to take out move tiles down where there are gaps
function realignStack() {
  //Iterate through each column

  for (var i = 0; i < 840; i+= 60) {
    //Get column

    var col = stack.children.entries.filter(child => child.body.x < i + 15 && child.body.x > i )
    col.sort(function(a, b){return b.body.y - a.body.y});

    //Set the current column
    var currcol = 0;
    var end = false;
    //Iterate through gaps
    for(var j = 520; j > 60; j-= 60) {
        if(col.length > 0 && !end) {
          //Check next sprite is not adjacent
          //if(col[j+1].body.y < col[j].body.y + 65 && col[j+1].body.y > col[j].body.y + 55) {
          if(!(j + 15 > col[currcol].body.y && j - 15 < col[currcol].body.y)) {
            //Gap detected
            var gap = j;
            console.log(gap);
            //Move block into gap
            //stack.create(col[currcol].body.x + 29, j + 20,col[currcol].texture);
            stack.create(col[currcol].body.x + 30, (Math.floor(col[currcol].body.y / 60) * 60) + 120,col[currcol].texture)
            col[currcol].destroy();
            //col[currcol].body.y = j;
            //stack.add(newsprite);
            currcol++;
            //Move tile down
            //col[j+1].body.x = gap.x;
            //col[j+1].body.y = gap.y;
          } else {
            currcol++;
          }
          //Control
          if(currcol == col.length) {
            end = true;
          }
        }
    }
  }
}


function update() {
  //Detect line creation
  //HORIZONTAL LINES
  //Iterate through each row
  /*
  var lines = [];

  for (var i = 520; i > 70; i-= 60) {
    //Get row and sort
    var row = stack.children.entries.filter(child => child.body.y < i && child.body.y > i - 15 );
    row.sort(function(a, b){return a.body.x - b.body.x});
    lineoffour = checkLineofFourX(row); //Check matches
    if(lineoffour.length > 0) {
      lines.push(lineoffour);
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
      console.log("Matchtiles");
      console.log(lineoffour);
    }
  }

  //console.log(lines);
  //If a match is detected then we need to do something with the blocks
  if(lines.length > 0) {
    for(var i=0;i<lines.length;i++) {
      for(var j=0;j<lines[i].length;j++) {
        //Deal with vertical
        if(lines[i][j].type === 'V') {
          //console.log(lines[i][j].matchedtiles);
          for(var k=0;k<lines[i][j].matchedtiles.length;k++) {
            var currenttile = lines[i][j].matchedtiles[k];
            var tilefromstack = stack.children.entries.filter(child => (child.body.x == currenttile.matchx && child.body.y == currenttile.matchy));
            //var frame = this.physics.scene.textures.getFrame(tilefromstack[0].texture, 'flashtile');
            if(typeof tilefromstack[0] === undefined) {
                console.log("undefined");
            }

            console.log("Tiles from Stack");
            console.log(tilefromstack);
            if(!tilefromstack[0].hasOwnProperty("flash")){
              var graphics = this.add.graphics({
                x: tilefromstack[0].body.x,
                y: tilefromstack[0].body.y
              })
              .fillStyle(0xffff00, 0.75)
              .fillRect(0, 0, tilefromstack[0].body.width, tilefromstack[0].body.height);

              //For tracking
              flashingtiles.push(graphics);

              this.tweens.add({
                targets: graphics,
                alpha: 0,
                ease: 'Cubic.easeOut',
                duration: 500,
                repeat: -1,
                yoyo: true
              });
              tilefromstack[0].flash = true;
              tilefromstack[0].flashcount = 0;
            } else {
              tilefromstack[0].flashcount++;
            }

            //Destroy if aged out
            if(tilefromstack[0].hasOwnProperty("flashcount")) {
              if(tilefromstack[0].flashcount >= 50) {
                console.log(flashingtiles);
                destroyFlashingTile(tilefromstack[0].body.x,tilefromstack[0].body.y);
                tilefromstack[0].destroy();
                flashing = false;
              } else {
                //So game can pause while the score is added
                flashing = true;
              }
            }
          }
        } else {
          //Horrizontal

          for(var k=0;k<lines[i][j].matchedtiles.length;k++) {
            var currenttile = lines[i][j].matchedtiles[k];
            var tilefromstack = stack.children.entries.filter(child => (child.body.x == currenttile.matchx && child.body.y == currenttile.matchy));
            //var frame = this.physics.scene.textures.getFrame(tilefromstack[0].texture, 'flashtile');

            if(!tilefromstack[0].hasOwnProperty("flash")){
              var graphics = this.add.graphics({
                x: tilefromstack[0].body.x,
                y: tilefromstack[0].body.y
              })
              .fillStyle(0xffff00, 0.75)
              .fillRect(0, 0, tilefromstack[0].body.width, tilefromstack[0].body.height);

              //For tracking
              flashingtiles.push(graphics);

              this.tweens.add({
                targets: graphics,
                alpha: 0,
                ease: 'Cubic.easeOut',
                duration: 500,
                repeat: -1,
                yoyo: true
              });
              tilefromstack[0].flash = true;
              tilefromstack[0].flashcount = 0;
            } else {
              tilefromstack[0].flashcount++;
            }

            //Destroy if aged out
            if(tilefromstack[0].hasOwnProperty("flashcount")) {
              if(tilefromstack[0].flashcount >= 50) {
                console.log(flashingtiles);
                destroyFlashingTile(tilefromstack[0].body.x,tilefromstack[0].body.y);
                tilefromstack[0].destroy();
                flashing = false;
              } else {
                //So game can pause while the score is added
                flashing = true;
              }
            }
          }

        }
      }
    }
  }

  */

  //Clear the lines variable for performance
  this.lines = [];
  //realignStack();

  if(!flashing) {
    // Configure the controls!
    if (!cursors.down.isDown) {
      if(touchcount > 0) {
        touchcount -= 1;
      }
      touched = false;
      brick.children.entries.forEach(child => child.y += 0.25);
      //// REVIEW: Line nleow not sure if the "!this.pysics.overlap" is needed
      if(cursors.left.isDown && touchcount == 0 && !this.overlap(brick,stack)) {
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
          console.log("Horizontal left");
          //Check not blocked
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x + 60,brick.children.entries[0].body.y - 60,'tile1');
          if(!this.physics.overlap(checksprite, stack)) {
            brick.children.entries[0].body.x += 60;
            brick.children.entries[0].body.y -= 60;
          }
        } else if(brick.children.entries[0].body.x > brick.children.entries[1].body.x + 5 && brick.children.entries[0].body.x > brick.children.entries[1].body.x - 5) {
          //Brick is horizontally alligned with first brick on right
          console.log("Horizontal right");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y + 60,'tile1');
          if(!this.physics.overlap(checksprite, stack)) {
            brick.children.entries[0].body.x -= 60;
            brick.children.entries[0].body.y += 60;
          }
        } else if (brick.children.entries[1].body.y > brick.children.entries[0].body.y + 5 && brick.children.entries[1].body.y > brick.children.entries[0].body.y - 5) {
          //Brick is orientated vertically and first brick is on top so rotate to horizontal position
          console.log("Virtical top");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x + 60,brick.children.entries[0].body.y + 60,'tile1');
          if(!this.physics.overlap(checksprite, stack)) {
            brick.children.entries[0].body.x += 60;
            brick.children.entries[0].body.y += 60;
          }
        } else if (brick.children.entries[0].body.y > brick.children.entries[1].body.y + 5 && brick.children.entries[0].body.y > brick.children.entries[1].body.y - 5) {
          //Brick is orientated vertically and first brick is on bottom so rotate to horizontal position
          console.log("Virtical bottom");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y - 60,'tile1');
          if(!this.physics.overlap(checksprite, stack)) {
            brick.children.entries[0].body.x -= 60;
            brick.children.entries[0].body.y -= 60;
          }
        }
        checksprite.destroy();
        touched = true;
        touchcount = 10;
      }
    } else {
      //brick.children.forEach(child => child.setVelocityY(300));
      brick.children.entries.forEach(child => child.y += 60);

    }
  } else { brick.setVelocityY(0); }
}

function tileHitsGroundOrBlock() {
  //console.log(lines);
  //lineoffour = checkLineofFourX(bottomrow);
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
  /*
  if(!(brick.children.entries[0].body.x >= brick.children.entries[1].body.x - 10 && brick.children.entries[0].body.x <= brick.children.entries[1].body.x + 10)) {
     //horizontal orientated
     var brick1y = brick.children.entries[0].body.y;
     //brick.children.each(child => stack.create(child.body.x + 30, brick1y + 30,child.texture));
     brick.children.each(child => stack.create(child.body.x + 30, (Math.floor(brick1y.body.y / 60) * 60) + 120,child.texture));
   } else {
     //brick.children.each(child => stack.create(child.body.x + 30, child.body.y + 30,child.texture));
     brick.children.each(child => stack.create(child.body.x + 30, (Math.floor(child.body.y / 60) * 60) + 120,child.texture));
   }*/

  brick.children.each(child => stack.create((Math.round(child.body.x / 60) * 60)+ 30, Math.round(child.body.y / 60) * 60,child.texture));
  console.log(stack);
  console.log(brick);
  brick.children.each(child => child.destroy());
  alert("Putting down");
  //var children = brick.getChildren();
  brick.clear();
  if(topofstack.length == 0) {
    //Add to stack
    //children.entries.forEach(child => stack.add(child));
    //children.entries.forEach(child => console.log(child));
    //stack.create(300,100, 'ground');
    //let brick = this.physics.add.group();
    //brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
    //brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));
    brick.create(360, 0, 'tile'+randomNumber(1,6));
    brick.create(420, 0, 'tile'+randomNumber(1,6));
    //console.log("Here");
    //ground.body.setAllowGravity(false);
    //ground.setVelocityY(0);
  } else {
    console.log(bottomrow);
  }
  console.log(bottomrow);
  //brick.children.each(child => child.body.blocked.left=true);

}
