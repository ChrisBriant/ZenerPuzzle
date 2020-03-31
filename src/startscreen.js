import Phaser from "phaser";

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function StartScreen() {
        Phaser.Scene.call(this, { key: 'StartScreen' , active: true  })
    },

    preload: function ()
    {
        this.load.image('face', './src/assets/bricks/brick1.png');
    },

    create: function ()
    {
        this.face = this.add.image(400, 300, 'face');
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function()
    {
      if (this.cursors.down.isDown) {
        this.scene.start('Scene');
      }
    }

});
