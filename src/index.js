import Phaser from "phaser";
import logoImg from "./assets/logo.png";
//import tile1 from './assets/bricks/tile1.png';
import {randomNumber} from './include.js';

let brick;
let ground;
let rightwall;
let leftwall;
let stack;
let stackCopy = [];
let cursors;
let score = 0;
let scoretext;
let touched = false;
let touchcount=0;
let flashgraphics = [];
let flashing = false;
let falling = false;
let justdestroyed = false;
let graphics;
let level = 1;
//Goals
let thisLevelGoals;
let tile1GText;
let tile2GText;
let tile3GText;
let tile4GText;
let tile5GText;


let updatecount = 0;
let stackCollider;
let groundCollider;
//Control variables - make local once tested
let bottomrow;
let lineoffour;
//let lines = [];




var StartScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function StartScreen() {
        Phaser.Scene.call(this, { key: 'StartScreen' })
    },

    preload: function ()
    {
        this.load.image('logo', './src/assets/logo.png');
        this.load.image('bricklogo', './src/assets/bricklogo.png');
    },

    create: function ()
    {
        this.logo = this.add.image(400, 100, 'logo');
        this.bricklogo = this.add.image(400,300,'bricklogo');
        this.add.text(260, 400, 'Controls:', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        this.add.text(260, 420, 'Arrow keys move the tiles', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        this.add.text(260, 440, 'Spacebar rotates the block', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        this.presstart = this.add.text(260, 480, 'Press spacebar to start', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.blinkOff = true;
        this.timer = this.time.addEvent({
          delay: 500,
          callback: this.blinkText,
          callbackScope: this,
          loop: true
        });
        console.log(this);
    },

    update: function()
    {
      if (this.cursors.space.isDown) {
        this.scene.start('MainGame');
      }
    },

    blinkText: function() {
      console.log(this.presstart);
      if(this.blinkOff) {
        //this.children.list[5].visible = false;
        this.presstart.visible = false;
        this.blinkOff = false;
      } else {
        //this.children.list[5].visible = true;
        this.presstart.visible = true;
        this.blinkOff = true;
      }
    }

});



var LevelStart = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function LevelStart() {
        Phaser.Scene.call(this, { key: 'LevelStart' });
    },

    preload: function ()
    {
      this.load.json('levelData', './src/assets/levels.json');

      this.load.image('tile1', './src/assets/bricks/tile1.png');
      this.load.image('tile2', './src/assets/bricks/tile2.png');
      this.load.image('tile3', './src/assets/bricks/tile3.png');
      this.load.image('tile4', './src/assets/bricks/tile4.png');
      this.load.image('tile5', './src/assets/bricks/tile5.png');
      this.load.image('ground', './src/assets/platform.png');
      this.load.image('block30x30', './src/assets/bricks/block30x30.png');
    },

    create: function ()
    {
      this.text = this.add.text(400, 250, 'Level ' + level);
      //this.text.anchor.set(0.5);
      this.text.align = 'center';

      this.text.font = 'Arial Black';
      this.text.fontSize = 70;
      this.text.fontWeight = 'bold';
      this.text.fill = '#ec008c';
      this.text.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
      this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)')

      //Create the scene
      setLevelGoals(this.cache.json.get('levelData'), this);
      this.add.tileSprite(400, 585, 800, 30, "block30x30");
      this.add.tileSprite(780, 300, 60, 595, "block30x30");
      this.add.tileSprite(195, 300, 30, 595, "block30x30");
      this.add.tileSprite(15, 300, 30, 595, "block30x30");
      this.add.tileSprite(90, 15, 240, 30, "block30x30");
      //Game text
      this.add.text(35, 30, 'Score:', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
      this.add.text(35, 50, pad(score), { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });

      this.timer = this.time.addEvent({
        delay: 2000,
        callback: this.nextScene,
        callbackScope: this,
        loop: true
      });
    },

    update: function()
    {
      /*
      if (this.cursors.space.isDown) {
        this.scene.start('MainGame');
      }*/
    },

    nextScene: function() {
      this.scene.start('MainGame');
    }

});


var LevelComplete = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function LevelComplete() {
        Phaser.Scene.call(this, { key: 'LevelComplete' });
    },

    preload: function ()
    {
      this.load.json('levelData', './src/assets/levels.json');

      this.load.image('tile1', './src/assets/bricks/tile1.png');
      this.load.image('tile2', './src/assets/bricks/tile2.png');
      this.load.image('tile3', './src/assets/bricks/tile3.png');
      this.load.image('tile4', './src/assets/bricks/tile4.png');
      this.load.image('tile5', './src/assets/bricks/tile5.png');
      this.load.image('ground', './src/assets/platform.png');
      this.load.image('block30x30', './src/assets/bricks/block30x30.png');
    },

    create: function ()
    {
      this.text = this.add.text(400, 250, 'Level ' + level + ' Complete');
      //this.text.anchor.set(0.5);
      this.text.align = 'center';

      this.text.font = 'Arial Black';
      this.text.fontSize = 70;
      this.text.fontWeight = 'bold';
      this.text.fill = '#ec008c';
      this.text.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
      this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)')

      //Create the scene
      setLevelGoals(this.cache.json.get('levelData'), this);
      this.add.tileSprite(400, 585, 800, 30, "block30x30");
      this.add.tileSprite(780, 300, 60, 595, "block30x30");
      this.add.tileSprite(195, 300, 30, 595, "block30x30");
      this.add.tileSprite(15, 300, 30, 595, "block30x30");
      this.add.tileSprite(90, 15, 240, 30, "block30x30");
      //Game text
      this.add.text(35, 30, 'Score:', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
      this.add.text(35, 50, pad(score), { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
      this.stack = this.physics.add.staticGroup();
      console.log('hi');
      stackCopy.forEach(item => this.stack.create(item.x, item.y,item.texture));
      //this.stackCopy = stack;

      this.timer = this.time.addEvent({
        delay: 2000,
        callback: this.nextScene,
        callbackScope: this,
        loop: true
      });
    },

    update: function()
    {
      /*
      if (this.cursors.space.isDown) {
        this.scene.start('MainGame');
      }*/
    },

    nextScene: function() {
      level += 1;
      this.scene.pause();
      //this.scene.start('LevelStart');
    }

});

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
  //scene: [ StartScreen, { key:"MainGame", preload: preload, create: create, update: update } ]
  scene: [ LevelStart, { key:"MainGame", preload: preload, create: create, update: update }, LevelComplete  ]
};


const game = new Phaser.Game(config);



function preload() {
  //this.load.image("logo", logoImg);
  //this.load.image('tile1', tile1);
}

//for score
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function setLevelGoals(leveldata, thisscene) {
  //Global level goals
  thisLevelGoals = leveldata['level'+level]['goals'];

  thisscene.add.text(60, 330, 'GOALS:', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
  if(leveldata['level'+level]['goals']['tile1'] > 0) {
    thisscene.add.image(60,370,'tile1').setScale(0.325);
    thisscene.add.image(80,370,'tile1').setScale(0.325);
    thisscene.add.image(100,370,'tile1').setScale(0.325);
    thisscene.add.image(120,370,'tile1').setScale(0.325);
    tile1GText = thisscene.add.text(140, 360, 'x' + leveldata['level'+level]['goals']['tile1'] , { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
  }
  if(leveldata['level'+level]['goals']['tile2'] > 0) {
    thisscene.add.image(60,400,'tile2').setScale(0.325);
    thisscene.add.image(80,400,'tile2').setScale(0.325);
    thisscene.add.image(100,400,'tile2').setScale(0.325);
    thisscene.add.image(120,400,'tile2').setScale(0.325);
    tile2GText = thisscene.add.text(140, 390,'x'+leveldata['level'+level]['goals']['tile2'], { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
  }
  if(leveldata['level'+level]['goals']['tile3'] > 0) {
    thisscene.add.image(60,430,'tile3').setScale(0.325);
    thisscene.add.image(80,430,'tile3').setScale(0.325);
    thisscene.add.image(100,430,'tile3').setScale(0.325);
    thisscene.add.image(120,430,'tile3').setScale(0.325);
    tile3GText = thisscene.add.text(140, 420, 'x'+leveldata['level'+level]['goals']['tile3'], { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
  }
  if(leveldata['level'+level]['goals']['tile4'] > 0) {
    thisscene.add.image(60,460,'tile4').setScale(0.325);
    thisscene.add.image(80,460,'tile4').setScale(0.325);
    thisscene.add.image(100,460,'tile4').setScale(0.325);
    thisscene.add.image(120,460,'tile4').setScale(0.325);
    tile4GText = thisscene.add.text(140, 450, 'x'+leveldata['level'+level]['goals']['tile4'], { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
  }
  if(leveldata['level'+level]['goals']['tile5'] > 0) {
    thisscene.add.image(60,490,'tile5').setScale(0.325);
    thisscene.add.image(80,490,'tile5').setScale(0.325);
    thisscene.add.image(100,490,'tile5').setScale(0.325);
    thisscene.add.image(120,490,'tile5').setScale(0.325);
    tile5GText = thisscene.add.text(140, 480, 'x'+leveldata['level'+level]['goals']['tile5'], { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
  }
}

function create() {
  //console.log(this.physics.overlap(brick,stack));
  //const logo = this.add.image(400, 150, "logo");

  //const logo = this.add.image(400, 150, "tile1");
  var levelData = this.cache.json.get('levelData');
  console.log(levelData);
  setLevelGoals(levelData, this);


  cursors = this.input.keyboard.createCursorKeys();
  brick = this.physics.add.group();
  brick.setVelocityY(80);
  brick.setVelocityX(0);
  //brick.create((this.game.config.width / 2) - 60, 0, 'tile'+randomNumber(1,6));
  //brick.create(this.game.config.width / 2, 0, 'tile'+randomNumber(1,6));
  brick.create(360, 0, 'tile'+randomNumber(1,6));
  brick.create(420, 0, 'tile'+randomNumber(1,6));

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

  groundCollider = this.physics.add.collider(brick, ground, tileHitsGroundOrBlock,null,this);
  //this.physics.add.collider(brick, ground, tileHitsGroundOrBlock,()=>{return colliderActivated;},this);

  stack = this.physics.add.staticGroup();
  //brick.children.entries.forEach(child => stack.create(child.body.x, child.body.y+100,child.texture));
  stackCollider = this.physics.add.collider(brick, stack, tileHitsGroundOrBlock,null,this);
  //this.physics.add.collider(brick, stack, tileHitsGroundOrBlock,()=>{return colliderActivated;},this);

}


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
  var consolodatedtiles = consolidateTilesY(matches);
  return consolodatedtiles;
}


//Remove the flashing graphics
function destroyFlashingTile(x,y) {
  var destroytile = flashgraphics.filter(child => child.x == x-30 && child.y == y-30);
  destroytile[0].destroy();
}

//Work around the issue where graphics is not detected
function killAllGraphics() {
  for(var i=0;i<flashgraphics.length;i++) {
    flashgraphics[0].destroy();
  }
}

//Calculate the score
function scoreTiles(tiles,thisscene) {
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
    if(thisLevelGoals['tile1'] > 0) {
      thisLevelGoals['tile1'] -= 1;
      tile1GText.setText('x' + thisLevelGoals['tile1']);
    }
  } else if (tilesof2.length > 0) {
    score += tilesof2.length * 10;
    if(thisLevelGoals['tile2'] > 0) {
      thisLevelGoals['tile2'] -= 1;
      tile2GText.setText('x' + thisLevelGoals['tile2']);
    }
  } else if (tilesof3.length > 0) {
    score += tilesof3.length * 10;
    if(thisLevelGoals['tile3'] > 0) {
      thisLevelGoals['tile3'] -= 1;
      tile3GText.setText('x' + thisLevelGoals['tile3']);
    }
  } else if (tilesof4.length > 0) {
    score += tilesof4.length * 10;
    if(thisLevelGoals['tile4'] > 0) {
      thisLevelGoals['tile4'] -= 1;
      tile4GText.setText('x' + thisLevelGoals['tile4']);
    }
  } else if (tilesof5.length > 0) {
    score += tilesof5.length * 10;
    if(thisLevelGoals['tile5'] > 0) {
      thisLevelGoals['tile5'] -= 1;
      tile5GText.setText('x' + thisLevelGoals['tile5']);
    }
  }

  //Set the tiles to scored
  nonscored.forEach(tile => tile.scored = true);
  var toGoal = thisLevelGoals['tile1'] +  thisLevelGoals['tile2'] + thisLevelGoals['tile3'] +
          thisLevelGoals['tile4'] + thisLevelGoals['tile5'];
  if(toGoal == 0) {
    //Copy the stack data and transition to next scene
    stack.children.entries.forEach(child => stackCopy.push({'x':child.x,'y':child.y,'texture':child.texture}));
    thisscene.scene.start('LevelComplete');
  }
}



function realignStack() {
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
          //var newx = col[k].x
          //var newy = col[k].y
          //var newt = col[k].texture
          //stack.remove(col[k]);
          col[k].setPosition(col[k].x,j).refreshBody();
          //col[k].setSize(50,60,29);
          //console.log(col[k].height);
          //stack.create(newx,newy,newt);
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
      //c.forEach(item => item.destroy());
      //col.forEach(item => stack.create(item.x,item.y,item.texture));
      col = [];
      //c.forEach(item => item.destroy());
    }
  }
}


function update() {
  //this.scene.pause();
  //this.scene.start('LevelComplete');

  if(updatecount == 10) {
    realignStack();
    detectLines(this);
    } else {
    updatecount += 1
  }
  //Get all of the flashing tiles
  var flashingtiles = stack.children.entries.filter(tile => (tile.flashcount == 0));

  if(flashingtiles.length > 0) {
    console.log(flashingtiles);
    //Stop movement
    brick.setVelocityY(0);

    for(var i=0;i<flashingtiles.length;i++) {
      graphics = this.add.graphics({
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
    // Configure the controls!
    if (!cursors.down.isDown) {

      if(touchcount > 0) {
        touchcount -= 1;
      }
      touched = false;
      //brick.children.entries.forEach(child => child.setVelocityY(80));
      brick.setVelocityY(80);
      //// REVIEW: Line nleow not sure if the "!this.pysics.overlap" is needed
      if(cursors.left.isDown && touchcount == 0 && !this.physics.overlap(brick,stack) && brick.children.entries.length > 1 ) {
        //Add a blank sprite to the left and check collides with stack
        var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y + 30);
        if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
          brick.children.entries.forEach(child => child.body.x -= 60);
        }
        checksprite.destroy();
        touched = true;
        touchcount = 10;
      } else if (cursors.right.isDown && touchcount == 0 && brick.children.entries.length > 1) {
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
        if(brick.children.entries.length > 1 && brick.children.entries[1].body.x > brick.children.entries[0].body.x + 5 && brick.children.entries[1].body.x > brick.children.entries[0].body.x - 5) {
          //Brick is horrizontally alligned so move to vertical orientation
          console.log("Horizontal left");
          //Check not blocked
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x + 60,brick.children.entries[0].body.y - 60,'tile1');
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
            brick.children.entries[0].body.x += 60;
            brick.children.entries[0].body.y -= 60;
          }
          checksprite.destroy();
        } else if(brick.children.entries.length > 1 && brick.children.entries[0].body.x > brick.children.entries[1].body.x + 5 && brick.children.entries[0].body.x > brick.children.entries[1].body.x - 5) {
          //Brick is horizontally alligned with first brick on right
          console.log("Horizontal right");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y + 60,'tile1');
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
            brick.children.entries[0].body.x -= 60;
            brick.children.entries[0].body.y += 60;
          }
          checksprite.destroy();
        } else if (brick.children.entries.length > 1 && brick.children.entries[1].body.y > brick.children.entries[0].body.y + 5 && brick.children.entries[1].body.y > brick.children.entries[0].body.y - 5) {
          //Brick is orientated vertically and first brick is on top so rotate to horizontal position
          console.log("Virtical top");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x + 60,brick.children.entries[0].body.y + 60,'tile1');
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
            brick.children.entries[0].body.x += 60;
            brick.children.entries[0].body.y += 60;
          }
          checksprite.destroy();
        } else if (brick.children.entries.length > 1 && brick.children.entries[0].body.y > brick.children.entries[1].body.y + 5 && brick.children.entries[0].body.y > brick.children.entries[1].body.y - 5) {
          //Brick is orientated vertically and first brick is on bottom so rotate to horizontal position
          console.log("Virtical bottom");
          var checksprite = this.physics.add.sprite(brick.children.entries[0].body.x - 60,brick.children.entries[0].body.y - 60,'tile1');
          if(!this.physics.overlap(checksprite, stack) && !this.physics.overlap(checksprite, rightwall) && !this.physics.overlap(checksprite, leftwall)) {
            brick.children.entries[0].body.x -= 60;
            brick.children.entries[0].body.y -= 60;
          }
          checksprite.destroy();
        }
        //checksprite.destroy();
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
      justdestroyed = true;
    }
  }

  if(justdestroyed && brick.children.entries.length == 0) {
    //detectLines();
    //Create new brick
    brick.create(360, 0, 'tile'+randomNumber(1,6));
    brick.create(420, 0, 'tile'+randomNumber(1,6));
    brick.children.each(child => child.body.setSize(50,60,29));
    justdestroyed =false;
    this.tweens.killAll();
    //There is a problem where the graphics remains on the screen still
    graphics.clear();
    graphics.destroy();
  }
}

function detectLines(thisscene) {
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
          scoreTiles(lines[i][j],thisscene);
          if (score > 0) {
            //this.add.text(35, 50, pad(score), { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
            console.log("Score");
            console.log(score);
            console.log(scoretext);
            scoretext.setText(pad(score));
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
  }
  //Clear the lines variable for performance
  lines = [];
}


function tileHitsGroundOrBlock() {
  updatecount = 0;
  var newBricksArray = [];

  brick.setVelocityY(0);

  var topofstack = brick.children.entries.filter(child => child.body.y < 60);
  if(stack.children.entries.length > 0) {
    var stackheight = Math.min.apply(Math, stack.children.entries.map(function(o) { return o.y; })) + 60;
  } else {
    stackheight = 630;
  }
  console.log("STACKHEIGHT");
  console.log(stackheight);
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

  console.log(brick.children.entries);
  var verticallyalligned = false;

  if(brick.children.entries.length > 1 && brick.children.entries[0].x >= brick.children.entries[1].x - 5 && brick.children.entries[0].x <= brick.children.entries[1].x + 5) {
    verticallyalligned = true;
  }

  console.log(brick.children.entries.length);

  if(verticallyalligned || brick.children.entries.length == 1) {
    console.log("len");
    console.log(brick.children.entries.length);
    for(var i=0;i<brick.children.entries.length;i++) {
      child = brick.children.entries[i];
      console.log("THE MATH");
      //console.log(Math.round(child.body.x / 60) * 60);
      //console.log(Math.round((child.y+1)/60)*60);
      //getYPositioninStack(child.body.y);
      newBricksArray.push({x:((Math.round(child.body.x / 60) * 60)),y:Math.round((child.body.y+1) / 60) * 60,t:child.texture});
      //stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y) / 60) * 60,child.texture);
      child.destroy();
    }
    for(var i=0;i<newBricksArray.length;i++) {
      stack.create(newBricksArray[i].x, newBricksArray[i].y,newBricksArray[i].t);

    }
    /*
    for(var i=0;i<brick.children.entries.length;i++) {
      var child = brick.children.entries[i];

      stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y+1) / 60) * 60,child.texture);
      brick.children.entries.forEach(brick => brick.body.y = child.body.y-30);
      child.destroy();
    }*/
  } else {
    for(var i=0;i<brick.children.entries.length;i++) {
      var child = brick.children.entries[i];

      if(child.body.blocked.down || child.y > stackheight) {
        //console.log(Math.round((child.body.y+1)));
        //Line below is *HOPEFULLY* fixing the fallthrough issue
        if(!verticallyalligned) {
          stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y+1) / 60) * 60,child.texture);
          brick.children.entries.forEach(brick => brick.body.y = child.body.y+1);
        } else {
          //brick.children.entries.forEach(brick => brick.body.y = child.body.x+1);
        }
        //alert("CREATED");
        //stack.create(((Math.round(child.body.x / 60) * 60)), stackheight-60,child.texture);
        child.destroy();
      }
    }
  }

  detectLines(this);

  var flashingtiles = stack.children.entries.filter(tile => (tile.flashcount == 0));


  if(topofstack.length == 0 && brick.children.entries.length == 0 && flashingtiles.length == 0) {
    //Add to stack
    brick.create(360, 0, 'tile'+randomNumber(1,6));
    brick.create(420, 0, 'tile'+randomNumber(1,6));
    brick.children.each(child => child.body.setSize(50,60,29));
    //groundCollider = this.physics.add.collider(brick, ground, tileHitsGroundOrBlock,null,this);
    //stackCollider = this.physics.add.collider(brick, stack, tileHitsGroundOrBlock,null,this);
  } else {
    console.log(stack);
  }

  console.log("graphics");
  console.log(graphics);

  if(topofstack) {
    for(var i=0; i<stack.children.entries.length;i++)
    {
      console.log(stack.children.entries[i].y);
    }
  }

}
