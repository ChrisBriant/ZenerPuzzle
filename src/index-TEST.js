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
let lives = 3;
let lifetext;
let level = 2;
let yvelocity = 0;
let playerdied = false;
let skulltiles = [];
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
let updatelock = false;



var StartScreen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function StartScreen() {
        Phaser.Scene.call(this, { key: 'StartScreen' })
    },

    preload: function ()
    {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image('logo', './src/assets/logo.png');
        this.load.image('bricklogo', './src/assets/bricklogo.png');
    },


    create: function ()
    {
        this.logo = this.add.image(400, 100, 'logo');
        this.bricklogo = this.add.image(400,300,'bricklogo');
        this.add.text(260, 400, 'Controls:', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        this.add.text(260, 420, 'Arrow keys move the tiles', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        this.add.text(260, 440, 'Spacebar rotates the block', { fontFamily: 'Finger Paint', fontSize: 20, color: '#ffffff' });
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
        lives = 3;
        level = 1;
        this.scene.start('LevelStart');
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


/*
var LevelStart = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function LevelStart() {
        Phaser.Scene.call(this, { key: 'LevelStart' });
    },

    preload: function ()
    {
      this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
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
      var thisscene = this;
      this.counter = 0;
      this.xcounter = 0;
      this.fountactive = false;

      WebFont.load({
          google: {
              families: [ 'Faster One', 'Finger Paint', 'Nosifer','Fontdiner Swanky' ]
          },
          active: function () {
            thisscene.fontactive = true;
            thisscene.lvltxt = thisscene.add.text(360, 0, 'Level ' + level, { fontFamily: 'Fontdiner Swanky', fontSize: 60, color: '#7b4585' });
            thisscene.lvltxt.setStroke('#bbbe4b',8);
            thisscene.lvltxt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

            thisscene.starttxt = thisscene.add.text(-230, 260, 'start', { fontFamily: 'Faster One', fontSize: 60, color: '#285bad' });
            thisscene.starttxt.setStroke('#58d16e',8);
            thisscene.starttxt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5)
          }
      });

      //Create the scene
      this.add.tileSprite(400, 585, 800, 30, "block30x30");
      this.add.tileSprite(780, 300, 60, 595, "block30x30");
      this.add.tileSprite(195, 300, 30, 595, "block30x30");
      this.add.tileSprite(15, 300, 30, 595, "block30x30");
      this.add.tileSprite(90, 15, 240, 30, "block30x30");
      //Game text
      this.add.text(35, 30, 'Score:', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
      this.add.text(35, 50, pad(score), { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });

      stack = this.physics.add.staticGroup();

      this.timer = this.time.addEvent({
        delay: 2000,
        callback: this.nextScene,
        callbackScope: this,
        loop: true
      });

    },

    update: function()
    {
      if(this.fontactive) {
        if(this.counter < 190) {
          this.counter += 5;
          this.lvltxt.setPosition(360,this.counter);
        }
        if(this.counter >= 190 && this.xcounter < 360) {
          this.xcounter += 20;
          this.starttxt.setPosition(this.xcounter,260);
        }
      }
    },

    nextScene: function() {
      this.scene.start('MainGame');
    }

});*/


var LevelStart= new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function LevelStart() {
        Phaser.Scene.call(this, { key: 'LevelStart' });
    },

    preload: function ()
    {
      this.load.json('levelData', './src/assets/levels.json');
    },

    create: function ()
    {
      this.add.text(260, 0, 'Level ' + level + ' Complete', { fontFamily: 'Arial', fontSize: 48, color: '#7b4585' });
      this.timer = this.time.addEvent({
        delay: 2000,
        callback: this.nextScene,
        callbackScope: this,
        loop: true
      });
    },

    update: function()
    {
    },

    nextScene: function() {
      //level += 1;
      if(level < 100) {
        updatelock = true;
        this.scene.start('MainGame');
      }
    }

});


var GameOver = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function GameOver() {
        Phaser.Scene.call(this, { key: 'GameOver' });
    },

    preload: function ()
    {
      this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
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

      var thisscene = this;
      this.counter = 0;
      this.fountactive = false;

      WebFont.load({
          google: {
              families: [ 'Faster One', 'Finger Paint', 'Nosifer','Fontdiner Swanky' ]
          },
          active: function () {
            if(lives == 0) {
              thisscene.lvltxt = thisscene.add.text(290, 0, 'Game Over', { fontFamily: 'Fontdiner Swanky', fontSize: 60, color: '#7b4585' });
            } else {
              thisscene.lvltxt = thisscene.add.text(260, 0, 'Oops Try Again', { fontFamily: 'Fontdiner Swanky', fontSize: 48, color: '#7b4585' });
            }
            thisscene.fontactive = true;
            thisscene.lvltxt.setStroke('#bbbe4b',8);
            thisscene.lvltxt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
          }
      });
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
      stack = this.physics.add.staticGroup();
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
      if(this.fontactive) {
        if(this.counter < 190) {
          this.counter += 5;
          if(lives == 0) {
            this.lvltxt.setPosition(290,this.counter);
          } else {
            this.lvltxt.setPosition(260,this.counter);
          }
        }
      }
    },

    nextScene: function() {
      playerdied = false;

      if(lives == 0) {
        this.scene.start('StartScreen');
      } else {
        console.log("Fing sick of this now!")
        this.scene.stop('MainGame');
        this.scene.start('MainGame');
      }
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
  //scene: [ StartScreen, LevelStart, { key:"MainGame", preload: preload, create: create, update: update }, LevelComplete, GameOver  ]
  scene: [ LevelStart, { key:"MainGame", preload: preload, create: create, update: update }, GameOver    ]
};


const game = new Phaser.Game(config);
//game.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');


function preload() {
  this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  this.load.json('levelData', './src/assets/levels.json');

  this.load.image('tile1', './src/assets/bricks/tile1.png');
  this.load.image('tile2', './src/assets/bricks/tile2.png');
  this.load.image('tile3', './src/assets/bricks/tile3.png');
  this.load.image('tile4', './src/assets/bricks/tile4.png');
  this.load.image('tile5', './src/assets/bricks/tile5.png');
  this.load.image('tile6', './src/assets/bricks/tile6.png');
  this.load.image('ground', './src/assets/platform.png');
  this.load.image('block30x30', './src/assets/bricks/block30x30.png');
  //this.load.image("logo", logoImg);
  //this.load.image('tile1', tile1);
}

//for score
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}


function create() {
  stack = this.physics.add.staticGroup();
  console.log("Created Stack");
  console.log(stack);
  updatelock = false;
}







function update() {
  if(!updatelock) {
    console.log("Hello")
    console.log(stack);

    //Testing levels load
    level++;
    this.scene.pause();
    this.scene.start('LevelStart');
    //END Testing levels load
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
            scoretext.setText(pad(score));
          }
          //Deal with vertical
          if(lines[i][j].type === 'V') {
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

  var verticallyalligned = false;

  if(brick.children.entries.length > 1 && brick.children.entries[0].x >= brick.children.entries[1].x - 5 && brick.children.entries[0].x <= brick.children.entries[1].x + 5) {
    verticallyalligned = true;
  }



  if(verticallyalligned || brick.children.entries.length == 1) {
    for(var i=0;i<brick.children.entries.length;i++) {
      child = brick.children.entries[i];
      newBricksArray.push({x:((Math.round(child.body.x / 60) * 60)),y:Math.round((child.body.y+1) / 60) * 60,t:child.texture});
      //stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y) / 60) * 60,child.texture);
      child.destroy();
    }
    for(var i=0;i<newBricksArray.length;i++) {
      stack.create(newBricksArray[i].x, newBricksArray[i].y,newBricksArray[i].t).refreshBody();

    }
  } else {
    for(var i=0;i<brick.children.entries.length;i++) {
      var child = brick.children.entries[i];

      if(child.body.blocked.down || child.y > stackheight) {
        //console.log(Math.round((child.body.y+1)));
        //Line below is *HOPEFULLY* fixing the fallthrough issue
        if(!verticallyalligned) {
          stack.create(((Math.round(child.body.x / 60) * 60)), Math.round((child.body.y+1) / 60) * 60,child.texture).refreshBody();
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
  }

  if(stackheight <= 120 && !playerdied) {
    playerdied = true;
    lives -= 1;
    this.scene.start('GameOver');
  }

}
