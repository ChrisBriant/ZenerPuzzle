import Phaser from "phaser";
import logoImg from "./assets/logo.png";
//import tile1 from './assets/bricks/tile1.png';
import {randomNumber} from './include.js';


/*
const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300, x:1 },
        debug: true
    }
  },
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};*/

//const game = new Phaser.Game(config);


export default new Phaser.Class({

  Extends: Phaser.Scene,
  initialize:
  function MainGame() {
      Phaser.Scene.call(this, { key: 'MainGame' , active: true  })
  },

  /*
  this.brick;
  this.ground;
  this.rightwall;
  this.leftwall;
  this.stack;
  this.cursors;
  this.score = 0;
  this.scoretext;
  this.touched = false;
  this.touchcount=0;
  this.flashgraphics = [];
  this.flashing = false;
  this.falling = false;
  this.justdestroyed = false;
  this.graphics;

  this.updatecount = 0;
  this.stackCollider;
  this.groundCollider;
  //Control variables - make local once tested
  this.bottomrow;
  this.lineoffour;
  */

   preload: function() {

    this.load.image('tile1', './src/assets/bricks/tile1.png');
    this.load.image('tile2', './src/assets/bricks/tile2.png');
    this.load.image('tile3', './src/assets/bricks/tile3.png');
    this.load.image('tile4', './src/assets/bricks/tile4.png');
    this.load.image('tile5', './src/assets/bricks/tile5.png');
    this.load.image('ground', './src/assets/platform.png');
    this.load.image('block30x30', './src/assets/bricks/block30x30.png');
  },

  //for score
  pad: function(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
  },

  create: function() {
    cursors = input.keyboard.createCursorKeys();
    brick = physics.add.group();
    brick.setVelocityY(80);
    brick.setVelocityX(0);
    brick.create(360, 0, 'tile'+randomNumber(1,6));
    brick.create(420, 0, 'tile'+randomNumber(1,6));


    brick.children.each(child => child.body.setSize(58,60,29));

    //Add the floor
    ground = physics.add.staticGroup();
    //ground.create(300,500, 'ground');
    floor = add.tileSprite(400, 585, 800, 30, "block30x30");
    ground.add(floor);

    //Add walls
    rightwall = physics.add.staticGroup();
    rwalltsprite = add.tileSprite(780, 300, 60, 595, "block30x30");
    rightwall.add(rwalltsprite);
    leftwall = physics.add.staticGroup();
    lwalltsprite = add.tileSprite(195, 300, 30, 595, "block30x30");
    leftwall.add(lwalltsprite);
    farleftwall = physics.add.staticGroup();
    flwalltsprite = add.tileSprite(15, 300, 30, 595, "block30x30");
    farleftwall.add(flwalltsprite);
    add.tileSprite(90, 15, 240, 30, "block30x30");
    //Game text
    add.text(35, 30, 'Score:', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
    scoretext = add.text(35, 50, pad(score), { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
    groundCollider = physics.add.collider(brick, ground, tileHitsGroundOrBlock,null,this);
    stack = physics.add.staticGroup();
    stackCollider = physics.add.collider(brick, stack, tileHitsGroundOrBlock,null,this);
  },


  consolidateTilesX: function(tiles) {
    if(this.tiles.length > 0) {
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
  },


  consolidateTilesY: function(tiles) {
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
  },

  checkLineofFourX: function(spritearray) {
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
    var consolodatedtiles = consolidateTilesX(matches);
    return consolodatedtiles;
  },


  checkLineofFourY: function(spritearray) {
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
    var consolodatedtiles = consolidateTilesY(matches);
    return consolodatedtiles;
  },


  //Remove the flashing graphics
  destroyFlashingTile: function(x,y) {
    var destroytile = flashgraphics.filter(child => child.x == x-30 && child.y == y-30);
    destroytile[0].destroy();
  },

  //Work around the issue where graphics is not detected
  killAllGraphics: function() {
    for(var i=0;i<flashgraphics.length;i++) {
      flashgraphics[0].destroy();
    }
  },

  //Calculate the score
  scoreTiles: function(tiles) {
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
  },



  realignStack: function() {
    var gapdetected = false;
    var destroySet = [];

    for (var i = 0; i < 840; i+= 60) {
      //Get column
      var c = stack.children.entries.filter(child => child.x == i);
      //c.forEach(item => item.destroy());
      var col = [...c];
      col.sort(function(a, b){return b.y - a.y});
      if(col.length > 0) {
        //alignCol(col,0);
        var j = 540;
        var k = 0;
        var minsize = Math.min.apply(Math, col.map(function(t) { return t.y; }));
        while(j > minsize) {
          //if(col[k].y <= j -5 && col[k].y >= j +5 ) {
          if(col[k].y != j) {
            gapdetected = true;
            col[k].setPosition(col[k].x,j).refreshBody();
            minsize = Math.min.apply(Math, col.map(function(t) { return t.y; }));
          }
          j -= 60;
          k++;
        }
        if(gapdetected) {
          col.forEach(i => console.log(i.height));
          console.log(stack);
          //thisscene.pause();
          gapdetected = false;
        }
        col = [];
      }
    }
  },


  update: function() {
    if(updatecount == 10) {
      realignStack();
      detectLines();
      } else {
      updatecount += 1
    }
    //Get all of the flashing tiles
    var flashingtiles = stack.children.entries.filter(tile => (tile.flashcount == 0));

    if(flashingtiles.length > 0) {
      console.log(this.flashingtiles);
      //Stop movement
      this.brick.setVelocityY(0);

      for(var i=0;i<this.flashingtiles.length;i++) {
        this.graphics = this.add.graphics({
          x: flashingtiles[i].x-30,
          y: flashingtiles[i].y-30
        })
        .fillStyle(0xffff00, 0.75)
        .fillRect(0, 0, flashingtiles[i].width, flashingtiles[i].height);

        this.flashgraphics.push(graphics);

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
      if(this.flashgraphics.length > 0) {
        //killAllGraphics();
      }
      if(this.tweens.length > 0) {
        alert("still tweens");
      }

      if (!this.cursors.down.isDown) {

        if(this.touchcount > 0) {
          this.touchcount -= 1;
        }
        this.touched = false;
        //brick.children.entries.forEach(child => child.setVelocityY(80));
        this.brick.setVelocityY(80);
        //// REVIEW: Line nleow not sure if the "!this.pysics.overlap" is needed
        if(this.cursors.left.isDown && this.touchcount == 0 && !this.physics.overlap(brick,stack) && this.brick.children.entries.length > 1 ) {
          //Add a blank sprite to the left and check collides with stack
          var checksprite = this.physics.add.sprite(this.brick.children.entries[0].body.x - 60,this.brick.children.entries[0].body.y + 30);
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, this.rightwall) && !this.physics.overlap(checksprite, this.leftwall)) {
            this.brick.children.entries.forEach(child => child.body.x -= 60);
          }
          checksprite.destroy();
          this.touched = true;
          this.touchcount = 10;
        } else if (this.cursors.right.isDown && this.touchcount == 0 && this.brick.children.entries.length > 1) {
          //Add a blank sprite to the left and check collides with stack
          var checksprite = this.physics.add.sprite(this.brick.children.entries[1].body.x + 60,this.brick.children.entries[0].body.y + 30);
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, this.rightwall) && !this.physics.overlap(checksprite, this.leftwall)) {
            brick.children.entries.forEach(child => child.body.x += 60);
          }
          checksprite.destroy();
          this.touched = true;
          this.touchcount = 10;
        } else if (this.cursors.space.isDown && this.touchcount == 0) {
          //Handle rotation
          if(this.brick.children.entries.length > 1 && this.brick.children.entries[1].body.x > this.brick.children.entries[0].body.x + 5 && this.brick.children.entries[1].body.x > this.brick.children.entries[0].body.x - 5) {
            //Brick is horrizontally alligned so move to vertical orientation
            console.log("Horizontal left");
            //Check not blocked
            var checksprite = this.physics.add.sprite(this.brick.children.entries[0].body.x + 60,this.brick.children.entries[0].body.y - 60,'tile1');
            if(!this.physics.overlap(checksprite, this.stack) && !this.physics.overlap(checksprite, this.rightwall) && !this.physics.overlap(checksprite, this.leftwall)) {
              brick.children.entries[0].body.x += 60;
              brick.children.entries[0].body.y -= 60;
            }
            checksprite.destroy();
          } else if(this.brick.children.entries.length > 1 && this.brick.children.entries[0].body.x > this.brick.children.entries[1].body.x + 5 && this.brick.children.entries[0].body.x > this.brick.children.entries[1].body.x - 5) {
            //Brick is horizontally alligned with first brick on right
            console.log("Horizontal right");
            var checksprite = this.physics.add.sprite(this.brick.children.entries[0].body.x - 60,this.brick.children.entries[0].body.y + 60,'tile1');
            if(!this.physics.overlap(checksprite, this.stack) && !this.physics.overlap(checksprite, this.rightwall) && !this.physics.overlap(checksprite, this.leftwall)) {
              this.brick.children.entries[0].body.x -= 60;
              this.brick.children.entries[0].body.y += 60;
            }
            checksprite.destroy();
          } else if (this.brick.children.entries.length > 1 && this.brick.children.entries[1].body.y > this.brick.children.entries[0].body.y + 5 && this.brick.children.entries[1].body.y > this.brick.children.entries[0].body.y - 5) {
            //Brick is orientated vertically and first brick is on top so rotate to horizontal position
            console.log("Virtical top");
            var checksprite = this.physics.add.sprite(this.brick.children.entries[0].body.x + 60,this.brick.children.entries[0].body.y + 60,'tile1');
            if(!this.physics.overlap(checksprite, this.stack) && !this.physics.overlap(checksprite, this.rightwall) && !this.physics.overlap(checksprite, this.leftwall)) {
              this.brick.children.entries[0].body.x += 60;
              this.brick.children.entries[0].body.y += 60;
            }
            checksprite.destroy();
          } else if (this.brick.children.entries.length > 1 && this.rick.children.entries[0].body.y > this.brick.children.entries[1].body.y + 5 && this.brick.children.entries[0].body.y > this.brick.children.entries[1].body.y - 5) {
            //Brick is orientated vertically and first brick is on bottom so rotate to horizontal position
            console.log("Virtical bottom");
            var checksprite = this.physics.add.sprite(this.brick.children.entries[0].body.x - 60,this.brick.children.entries[0].body.y - 60,'tile1');
            if(!this.physics.overlap(checksprite, this.stack) && !this.physics.overlap(checksprite, this.rightwall) && !this.physics.overlap(checksprite, this.leftwall)) {
              this.brick.children.entries[0].body.x -= 60;
              this. brick.children.entries[0].body.y -= 60;
            }
            checksprite.destroy();
          }
          //checksprite.destroy();
          this.touched = true;
          this.touchcount = 10;
        } else {
          this.brick.setVelocityX(0);
        }
      } else {
        //brick.children.entries.forEach(child => child.setVelocityY(300));
        this.brick.setVelocityY(300);
      }
    }

    //Increment the flashing tiles
    var incrementflashtiles = stack.children.entries.filter(tile => (tile.flashcount >= 0));
    incrementflashtiles.forEach(flashing => flashing.flashcount++);
    for (var i =0;i<incrementflashtiles.length;i++) {
      if(incrementflashtiles[i].flashcount >= 20) {
        destroyFlashingTile(incrementflashtiles[i].x, incrementflashtiles[i].y);
        incrementflashtiles[i].destroy();
        this.justdestroyed = true;
      }
    }

    if(this.justdestroyed && this.brick.children.entries.length == 0) {
      //detectLines();
      //Create new brick
      this.brick.create(360, 0, 'tile'+randomNumber(1,6));
      this.brick.create(420, 0, 'tile'+randomNumber(1,6));
      this.brick.children.each(child => child.body.setSize(50,60,29));
      this.justdestroyed =false;
      this.tweens.killAll();
      //There is a problem where the graphics remains on the screen still
      this.graphics.clear();
      this.graphics.destroy();
    }
  },

  detectLines: function() {
    if(this.brick.children.entries.length == 0) {
      //Detect line creation
      //HORIZONTAL LINES
      //Iterate through each row
      var lines = [];

      for (var i = 540; i > 0; i-= 60) {
        //Get row and sort
        //var row = stack.children.entries.filter(child => child.body.y < i && child.body.y > i - 15 );
        var row = this.stack.children.entries.filter(child => child.y == i );
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
        var col = this.stack.children.entries.filter(child => child.x == i );
        col.sort(function(a, b){return a.body.y - b.body.y});
        this.lineoffour = checkLineofFourY(col); //Check matches
        if(this.lineoffour.length > 0) {
          lines.push(lineoffour);
          console.log("Matchtiles");
          console.log(this.lineoffour);
        }
      }

      //console.log(lines);
      //If a match is detected then we need to do something with the blocks

      if(lines.length > 0) {
        for(var i=0;i<lines.length;i++) {
          for(var j=0;j<lines[i].length;j++) {
            scoreTiles(lines[i][j]);
            if (this.score > 0) {
              //this.add.text(35, 50, pad(score), { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
              console.log("Score");
              console.log(this.score);
              console.log(this.scoretext);
              this.scoretext.setText(pad(this.score));
              //thescene.pause();
            }
            //Deal with vertical
            if(lines[i][j].type === 'V') {
              console.log("LINES");
              console.log(lines[i][j].matchedtiles);
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
                var tilefromstack = this.stack.children.entries.filter(child => (child.x == currenttile.matchx && child.y == currenttile.matchy));

                if(!tilefromstack[0].hasOwnProperty("flash")){
                  tilefromstack[0].flash = true;
                  tilefromstack[0].flashcount = 0;
                }
              }
            }
          }
        }
      }
    }
    //Clear the lines variable for performance
    lines = [];
  },


  tileHitsGroundOrBlock: function() {
    this.updatecount = 0;
    var newBricksArray = [];

    this.brick.setVelocityY(0);

    var topofstack = this.brick.children.entries.filter(child => child.body.y < 60);
    if(this.stack.children.entries.length > 0) {
      var stackheight = Math.min.apply(Math, this.stack.children.entries.map(function(o) { return o.y; })) + 60;
    } else {
      stackheight = 630;
    }
    console.log("STACKHEIGHT");
    console.log(stackheight);

    console.log(brick.children.entries);
    var verticallyalligned = false;

    if(this.brick.children.entries.length > 1 && this.brick.children.entries[0].x >= this.brick.children.entries[1].x - 5 && this.brick.children.entries[0].x <= this.brick.children.entries[1].x + 5) {
      verticallyalligned = true;
    }

    console.log(this.brick.children.entries.length);

    if(verticallyalligned || this.brick.children.entries.length == 1) {
      console.log("len");
      console.log(this.brick.children.entries.length);
      for(var i=0;i<this.brick.children.entries.length;i++) {
        child = this.brick.children.entries[i];
        console.log("THE MATH");
        //console.log(Math.round(child.body.x / 60) * 60);
        //console.log(Math.round((child.y+1)/60)*60);
        //getYPositioninStack(child.body.y);
        newBricksArray.push({x:((Math.round(child.body.x / 60) * 60)),y:Math.round((child.body.y+1) / 60) * 60,t:child.texture});
        //stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y) / 60) * 60,child.texture);
        child.destroy();
      }
      for(var i=0;i<newBricksArray.length;i++) {
        this.stack.create(newBricksArray[i].x, newBricksArray[i].y,newBricksArray[i].t);

      }
    } else {
      for(var i=0;i<this.brick.children.entries.length;i++) {
        var child = this.brick.children.entries[i];

        if(child.body.blocked.down || child.y > stackheight) {
          //console.log(Math.round((child.body.y+1)));
          //Line below is *HOPEFULLY* fixing the fallthrough issue
          if(!verticallyalligned) {
            this.stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y+1) / 60) * 60,child.texture);
            this.brick.children.entries.forEach(brick => brick.body.y = child.body.y+1);
          }
          child.destroy();
        }
      }
    }

    this.detectLines();

    var flashingtiles = this.stack.children.entries.filter(tile => (tile.flashcount == 0));


    if(topofstack.length == 0 && this.brick.children.entries.length == 0 && flashingtiles.length == 0) {
      //Add to stack
      this.brick.create(360, 0, 'tile'+randomNumber(1,6));
      this.brick.create(420, 0, 'tile'+randomNumber(1,6));
      this.brick.children.each(child => child.body.setSize(50,60,29));
      //groundCollider = this.physics.add.collider(brick, ground, tileHitsGroundOrBlock,null,this);
      //stackCollider = this.physics.add.collider(brick, stack, tileHitsGroundOrBlock,null,this);
    } else {
      console.log(this.stack);
    }

    console.log("graphics");
    console.log(this.graphics);

    if(topofstack) {
      for(var i=0; i<this.stack.children.entries.length;i++)
      {
        console.log(this.stack.children.entries[i].y);
      }
    }
  }

});
