import Phaser from 'phaser'
const MAX_LIFE = 3;

class NonPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 300, 600, 'player');
    this.scene = scene;
    this.life = MAX_LIFE;
    this.isAlive = true;
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.scale = 3; //scaled up from low-res sprite, we can just make larger sprites if needed 
  }

  speak() {
    //add message here
    console.log("talk");
    this.scene.showMessage();
  }

  updateLife(amount = -1) {
    if (this.life > 0 && !this.invincible) {
      this.invincible = true;
      setTimeout(() => {
        this.invincible = false;
      }, 1000);
    }
    if (this.life <= 0) {
      this.die();
    }
    return this.life;
  }

  die() {
    if (this.isAlive) {
      this.visible = false;
      this.isAlive = false;
      this.scene.sound.play('death');
      setTimeout(() => {
        this.scene.scene.restart();
      }, 2100);
    }
  }


  update() {
    if (!this.body) {
      return;
    }

  }
}

NonPlayer.MAX_LIFE = MAX_LIFE;

export default NonPlayer;
