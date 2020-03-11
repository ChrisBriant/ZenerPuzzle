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
let rightwall;
let leftwall;
let stack;
let cursors;
let score = 0;
let scoretext;
let touched = false;
let touchcount=0;
let flashgraphics = [];
let flashing = false;
let falling = false;

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

//for score
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function create() {
  //console.log(this.physics.overlap(brick,stack));
  //const logo = this.add.image(400, 150, "logo");

  //const logo = this.add.image(400, 150, "tile1");


  cursors = this.input.keyboard.createCursorKeys();
  brick = this.physics.add.group();
  brick.setVelocityY(80);
  brick.setVelocityX(0);
  //brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
  //brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));
  brick.create(360, 0, 'tile'+randomNumber(1,6));
  brick.create(420, 0, 'tile'+randomNumber(1,6));
  console.log(brick);

  //brick.children.each(child => child.body.checkCollision.left = false);
  //brick.children.each(child => child.body.checkCollision.right = false);
  brick.children.each(child => child.body.setSize(58,60,29));
  //brick.children.each(child => child.body.blocked.left=true);
  //Add the floor
  //ground = this.physics.add.sprite(300,this.game.config.height / 2 - 100, 'ground');
  ground = this.physics.add.staticGroup();
  //ground.create(300,500, 'ground');
  var floor = this.add.tileSprite(400, 585, 800, 30, "block30x30");
  ground.add(floor);

  //Add walls
  rightwall = this.physics.add.staticGroup();
  var rwalltsprite = this.add.tileSprite(780, 300, 60, 595, "block30x30");
  rightwall.add(rwalltsprite);
  leftwall = this.physics.add.staticGroup();
  var lwalltsprite = this.add.tileSprite(195, 300, 30, 595, "block30x30");
  leftwall.add(lwalltsprite);
  var farleftwall = this.physics.add.staticGroup();
  var flwalltsprite = this.add.tileSprite(15, 300, 30, 595, "block30x30");
  farleftwall.add(flwalltsprite);
  this.add.tileSprite(90, 15, 240, 30, "block30x30");
  //Game text
  this.add.text(35, 30, 'Score:', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
  scoretext = this.add.text(35, 50, pad(score), { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
  //ground.body.setAllowGravity(false);
  this.physics.add.collider(brick, ground, tileHitsGroundOrBlock,null,this);

  stack = this.physics.add.staticGroup();
  //brick.children.entries.forEach(child => stack.create(child.body.x, child.body.y+100,child.texture));
  this.physics.add.collider(brick, stack, tileHitsGroundOrBlock,null,this);

}


/*
function checkInsideSprite(x,y,sprite) {
  if(sprite.body.left < x && sprite.body.right > x && sprite.body.top < y && sprite.body.bottom > y) {
    return true;
  } else {
    return false;
  }
}*/
function adjacent(sprite1,sprite2,axis) {
  if (axis === 'Y') {
    if(sprite2.body.y < sprite1.body.y + 65 && sprite2.body.y > sprite1.body.y + 55) {
      return true;
    } else {
      return false;
    }
  } else {
    //Fill in for x axis
  }
}

function tilesmatch(sprite1,sprite2,axis) {
  if(axis === 'Y') {
    console.log("TEXTURES");
    if(sprite2.texture.key === sprite1.texture.key) {
      console.log("MATCH");
      return true;
    } else {
      return false;
    }
  } else {
      //Fill in for x axis
  }
}

function consolidateTilesX(tiles) {
  if(tiles.length > 0) {
    var block = [];

    for(var i=0;i<tiles.length;i++) {
      for(var j=0;j<tiles[i].matchedtiles.length;j++) {
        block.push(tiles[i].matchedtiles[j].matchx);
      }
    }
    var blockunique = Array.from(new Set(block));
    var blockuniquewithy = [];
    for(var i = 0;i<blockunique.length;i++) {
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
      blockuniquewithy.push({matchx:tiles[0].matchedtiles[0].matchx,matchy:blockunique[i]});
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
      if(spritearray[i+1].x == spritearray[i].x + 60) {
        //Check texture is the same
        if(spritearray[i+1].texture.key === spritearray[i].texture.key) {
            matchcount++;
            matchedtiles.push({matchx:spritearray[i].x,matchy:spritearray[i].y});
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
        matchingrow.push({matchx:spritearray[i+1].x,matchy:spritearray[i+1].y});
        matches.push({texture:spritearray[i].texture.key,matchedtiles:matchingrow,matchcount:matchcount,type:'V'});
      }
    }
  }
  /*
  if(matches.length > 0) {
    console.log("MATCH");
    console.log(spritearray);
    console.log(matches);
    var consolodatedtiles = consolidateTilesX(matches);
    console.log(consolodatedtiles);
    alert("Match");
  }*/
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
      //if(spritearray[i+1].body.y <= spritearray[i].body.y + 65 && spritearray[i+1].body.y >= spritearray[i].body.y + 55) {
      if(spritearray[i+1].y == spritearray[i].y + 60) {
        //Check texture is the same
        if(spritearray[i+1].texture.key === spritearray[i].texture.key) {
            matchcount++;
            matchedtiles.push({matchx:spritearray[i].x,matchy:spritearray[i].y});
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
        matchingrow.push({matchx:spritearray[i+1].x,matchy:spritearray[i+1].y});
        matches.push({texture:spritearray[i].texture.key,matchedtiles:matchingrow,matchcount:matchcount,type:'V'});
      }
    }
  }
  /*
  if(matches.length > 0) {
    console.log("MATCH");
    console.log(spritearray);
    console.log(matches);
    var consolodatedtiles = consolidateTilesY(matches);
    console.log(consolodatedtiles);
    alert("Match");
  } else {
    consolodatedtiles = [];
  } */
  var consolodatedtiles = consolidateTilesY(matches);
  return consolodatedtiles;
}


//Remove the flashing graphics
function destroyFlashingTile(x,y) {
  var destroytile = flashgraphics.filter(child => child.x == x-30 && child.y == y-30);
  destroytile[0].destroy();
}

//Calculate the score
function scoreTiles(tiles) {
  var scoretiles = [];

  for(var i=0;i<tiles.matchedtiles.length;i++) {
    var currenttile = tiles.matchedtiles[i];
    var tilefromstack = stack.children.entries.filter(child => (child.x == currenttile.matchx && child.y == currenttile.matchy));
    scoretiles.push(tilefromstack[0]);
  }

  var nonscored = scoretiles.filter(tile => (!tile.hasOwnProperty("scored")));

  var tilesof1 = nonscored.filter(tile => (tile.texture.key == 'tile1'));
  var tilesof2 = nonscored.filter(tile => (tile.texture.key == 'tile2'));
  var tilesof3 = nonscored.filter(tile => (tile.texture.key == 'tile3'));
  var tilesof4 = nonscored.filter(tile => (tile.texture.key == 'tile4'));
  var tilesof5 = nonscored.filter(tile => (tile.texture.key == 'tile5'));

  if (tilesof1.length > 0) {
    score += tilesof1.length * 10;
  } else if (tilesof2.length > 0) {
    score += tilesof2.length * 10;
  } else if (tilesof3.length > 0) {
    score += tilesof3.length * 10;
  } else if (tilesof4.length > 0) {
    score += tilesof4.length * 10;
  } else if (tilesof5.length > 0) {
    score += tilesof5.length * 10;
  }

  //Set the tiles to scored
  nonscored.forEach(tile => tile.scored = true);
}



//Sort the stack to take out move tiles down where there are gaps
function realignStack() {
  //Iterate through each column

  for (var i = 0; i < 840; i+= 60) {
    //Get column
    var col = stack.children.entries.filter(child => child.x == i)
    col.sort(function(a, b){return b.body.y - a.body.y});
    //Set the current column
    var currcol = 0;
    var end = false;
    //Iterate through gaps
    for(var j = 520; j > 60; j-= 60) {
        if(col.length > 0 && !end) {
          //Check next sprite is not adjacent
          if(!(j + 15 >= col[currcol].body.y && j - 15 <= col[currcol].body.y)) {
            //Gap detected
            alert("GAP DETECTED");
            //Move tile down
            brick.create(col[currcol].body.x+30, col[currcol].body.y+30, col[currcol].texture);
            col[currcol].destroy();
            currcol++;
          } else {
            currcol++;
          }
          //Control
          if(currcol == col.length) {
            end = true;
          }
        }
    }
    //Change the collision domain
    brick.children.each(child => child.body.setSize(50,60,29));
  }
}


function update() {

  //Get all of the flashing tiles
  var flashingtiles = stack.children.entries.filter(tile => (tile.flashcount == 0));

  if(flashingtiles.length > 0) {
    console.log(flashingtiles);
    //Stop movement
    brick.setVelocityY(0);

    for(var i=0;i<flashingtiles.length;i++) {
      var graphics = this.add.graphics({
        x: flashingtiles[i].x-30,
        y: flashingtiles[i].y-30
      })
      .fillStyle(0xffff00, 0.75)
      .fillRect(0, 0, flashingtiles[i].width, flashingtiles[i].height);

      flashgraphics.push(graphics);

      this.tweens.add({
        targets: graphics,
        alpha: 0,
        ease: 'Cubic.easeOut',
        duration: 500,
        repeat: -1,
        yoyo: true
      });

    }
  } else {
    //Create a new brick if it is now destroyed
    /*
    if(brick.children.entries.length == 0) {
      brick.create(360, 0, 'tile'+randomNumber(1,6));
      brick.create(420, 0, 'tile'+randomNumber(1,6));
      brick.children.each(child => child.body.setSize(50,60,29));
    }*/
    // Configure the controls!
    if (!cursors.down.isDown) {
      if(touchcount > 0) {
        touchcount -= 1;
      }
      touched = false;
      //brick.children.entries.forEach(child => child.setVelocityY(80));
      brick.setVelocityY(80);
      //// REVIEW: Line nleow not sure if the "!this.pysics.overlap" is needed
      if(cursors.left.isDown && touchcount == 0 && !this.physics.overlap(brick,stack)) {
        //Add a blank sprite to the left and check collides with stack
        var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y + 30);
        if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
          brick.children.entries.forEach(child => child.body.x -= 60);
        }
        checksprite.destroy();
        touched = true;
        touchcount = 10;
      } else if (cursors.right.isDown && touchcount == 0) {
        //Add a blank sprite to the left and check collides with stack
        var checksprite = this.physics.add.sprite(brick.children.entries[1].body.x + 60,brick.children.entries[0].body.y + 30);
        if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
          brick.children.entries.forEach(child => child.body.x += 60);
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
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
            brick.children.entries[0].body.x += 60;
            brick.children.entries[0].body.y -= 60;
          }
        } else if(brick.children.entries[0].body.x > brick.children.entries[1].body.x + 5 && brick.children.entries[0].body.x > brick.children.entries[1].body.x - 5) {
          //Brick is horizontally alligned with first brick on right
          console.log("Horizontal right");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y + 60,'tile1');
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
            brick.children.entries[0].body.x -= 60;
            brick.children.entries[0].body.y += 60;
          }
        } else if (brick.children.entries[1].body.y > brick.children.entries[0].body.y + 5 && brick.children.entries[1].body.y > brick.children.entries[0].body.y - 5) {
          //Brick is orientated vertically and first brick is on top so rotate to horizontal position
          console.log("Virtical top");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x + 60,brick.children.entries[0].body.y + 60,'tile1');
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
            brick.children.entries[0].body.x += 60;
            brick.children.entries[0].body.y += 60;
          }
        } else if (brick.children.entries[0].body.y > brick.children.entries[1].body.y + 5 && brick.children.entries[0].body.y > brick.children.entries[1].body.y - 5) {
          //Brick is orientated vertically and first brick is on bottom so rotate to horizontal position
          console.log("Virtical bottom");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y - 60,'tile1');
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
            brick.children.entries[0].body.x -= 60;
            brick.children.entries[0].body.y -= 60;
          }
        }
        checksprite.destroy();
        touched = true;
        touchcount = 10;
      } else {
        brick.setVelocityX(0);
      }
    } else {
      //brick.children.entries.forEach(child => child.setVelocityY(300));
      brick.setVelocityY(300);
    }
  }

  //Increment the flashing tiles
  var incrementflashtiles = stack.children.entries.filter(tile => (tile.flashcount >= 0));
  incrementflashtiles.forEach(flashing => flashing.flashcount++);
  for (var i =0;i<incrementflashtiles.length;i++) {
    if(incrementflashtiles[i].flashcount >= 20) {
      destroyFlashingTile(incrementflashtiles[i].x, incrementflashtiles[i].y);
      incrementflashtiles[i].destroy();
    }
  }
}

function tileHitsGroundOrBlock() {
  brick.setVelocityY(0);
  //console.log(lines);
  //lineoffour = checkLineofFourX(bottomrow);
  //console.log(lineoffour);

  //console.log(brick);
  //brick.children.each(child => console.log(child.body.overlapY));
  //console.log(brick.children.entries.filter(child => child.body.touching));
  //brick.children.each(child => console.log(child.body));
  //var children = brick.getChildren();
  var topofstack = brick.children.entries.filter(child => child.body.y < 60);
  if(stack.children.entries.length > 0) {
    var stackheight = Math.min.apply(Math, stack.children.entries.map(function(o) { return o.y; })) + 60;
  } else {
    stackheight = 630;
  }
  console.log("STACKHEIGHT");
  console.log(stackheight);
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

   //CHECK HERE
   //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/arcade-body/#collision-bound

  //brick.children.each(child => stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y+1) / 60) * 60,child.texture));

  //Length not right ??????
  console.log(brick.children.entries);
  var verticallyalligned = false;

  if(brick.children.entries.length > 1 && brick.children.entries[0].x >= brick.children.entries[1].x - 5 && brick.children.entries[0].x <= brick.children.entries[1].x + 5) {
    verticallyalligned = true;
  }

  for(var i=0;i<brick.children.entries.length;i++) {
    var child = brick.children.entries[i];
    //console.log(i);
    //console.log("touching");
    //console.log(child.body.touching);
    //console.log(child.y);
    if(child.y > stackheight) {
      console.log(child);
      //alert("More than stackheight");
    }
    if(child.body.blocked.down || child.y > stackheight) {
      //console.log(Math.round((child.body.y+1)));
      stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y+1) / 60) * 60,child.texture);
      //Line below is *HOPEFULLY* fixing the fallthrough issue
      if(!verticallyalligned) {
        brick.children.entries.forEach(brick => brick.body.y = child.body.y+1);
      }
      //alert("CREATED");
      //stack.create(((Math.round(child.body.x / 60) * 60)), stackheight-60,child.texture);
      child.destroy();
      //Clear gaps
    }
  }


  //stack.children.each(child => child.body.checkCollision.right = false);
  //brick.children.each(child => child.destroy());
  //var children = brick.getChildren();
  //brick.clear();

  if(brick.children.entries.length == 0) {
    //Detect line creation
    //HORIZONTAL LINES
    //Iterate through each row
    var lines = [];

    for (var i = 540; i > 0; i-= 60) {
      //Get row and sort
      //var row = stack.children.entries.filter(child => child.body.y < i && child.body.y > i - 15 );
      var row = stack.children.entries.filter(child => child.y == i );
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
      //var col = stack.children.entries.filter(child => child.body.x < i + 15 && child.body.x > i );
      var col = stack.children.entries.filter(child => child.x == i );
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
          scoreTiles(lines[i][j]);
          if (score > 0) {
            console.log("Score");
            console.log(score);
          }
          //Deal with vertical
          if(lines[i][j].type === 'V') {
            //console.log(lines[i][j].matchedtiles);
            for(var k=0;k<lines[i][j].matchedtiles.length;k++) {
              var currenttile = lines[i][j].matchedtiles[k];
              var tilefromstack = stack.children.entries.filter(child => (child.x == currenttile.matchx && child.y == currenttile.matchy));

              if(!tilefromstack[0].hasOwnProperty("flash")){
                tilefromstack[0].flash = true;
                tilefromstack[0].flashcount = 0;
              }
            }
          } else {
            //Horrizontal

            for(var k=0;k<lines[i][j].matchedtiles.length;k++) {
              var currenttile = lines[i][j].matchedtiles[k];
              var tilefromstack = stack.children.entries.filter(child => (child.x == currenttile.matchx && child.y == currenttile.matchy));

              if(!tilefromstack[0].hasOwnProperty("flash")){
                tilefromstack[0].flash = true;
                tilefromstack[0].flashcount = 0;
              }
            }
          }
        }
      }
    }
    //Clear the lines variable for performance
    this.lines = []
  }

  var flashingtiles = stack.children.entries.filter(tile => (tile.flashcount == 0));


  if(topofstack.length == 0 && brick.children.entries.length == 0 && flashingtiles.length == 0) {
    //Add to stack
    //children.entries.forEach(child => stack.add(child));
    //children.entries.forEach(child => console.log(child));
    //stack.create(300,100, 'ground');
    //let brick = this.physics.add.group();
    //brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
    //brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));
    brick.create(360, 0, 'tile'+randomNumber(1,6));
    brick.create(420, 0, 'tile'+randomNumber(1,6));
    //brick.children.each(child => child.body.checkCollision.left = false);
    //brick.children.each(child => child.body.checkCollision.right = false);
    brick.children.each(child => child.body.setSize(50,60,29));
    //console.log("Here");
    //ground.body.setAllowGravity(false);
    //ground.setVelocityY(0);
  } else {
    console.log(stack);
  }
}
