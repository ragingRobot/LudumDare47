import Phaser from 'phaser'
import Controller from '../Controller.js'

const WALK_SPEED = 300;
const MAX_LIFE = 5;

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 300, 600, 'player');
    this.scene = scene;
    this.life = 5;
    this.isAlive = true;
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  updateLife(amount = -1) {
    if (this.life > 0 && !this.invincible && !this.isHitting) {
      this.life += amount;
      if (this.life >= 1) {
      this.scene.sound.play('pain');
      }
      this.invincible = true;
      this.alpha = .5;
      setTimeout(() => {
        this.invincible = false;
        this.alpha = 1;
      }, 1000);
    }
    if (this.life <= 0) {
      this.die();
    }
    return this.life;
  }

  die() {
    if (this.isAlive) {
      // this.visible = false;
      this.isAlive = false;
      
      if (this.life == 0 ) {this.scene.sound.play('pain-2');
      this.anims.play('death', true);}
    }
  }


  update() {
    if (!this.body || !this.isAlive) {
      return;
    }

    if (this.cursors.left.isDown  || Controller.left) // if the left arrow key is down
    {
      this.body.setVelocityX(-WALK_SPEED); // move left
      this.anims.play('left', true);
    }
    else if (this.cursors.right.isDown || Controller.right) // if the right arrow key is down
    {
      this.body.setVelocityX(WALK_SPEED); // move right
      this.anims.play('right', true);
    } else {
      this.body.setVelocityX(this.body.velocity.x / 1.2);
    }



    if (this.cursors.up.isDown  || Controller.up) // if the up arrow key is down
    {
      this.body.setVelocityY(-WALK_SPEED); // move up
      this.anims.play('up', true);
    }
    else if (this.cursors.down.isDown || Controller.down) // if the down arrow key is down
    {
      this.body.setVelocityY(WALK_SPEED); // move down
      this.anims.play('down', true);
    } else {
      this.body.setVelocityY(this.body.velocity.y / 1.2);
    }

    if (this.cursors.space.isDown || Controller.action1) { // hit on space bar
        this.anims.play('hitdown', true);
        this.isHitting = true;
    } else {
      this.isHitting = false
    }
    
  }
}

Player.MAX_LIFE = MAX_LIFE;

export default Player;
