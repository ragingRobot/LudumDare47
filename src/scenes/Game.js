/* globals __DEV__ */
import Phaser from 'phaser'
import WinScreen from '../winScreen'
import GravityController from '../GravityController';
import { TweenMax } from "gsap";

const TILE_SIZE = 128;
const WALK_SPEED = 300;

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.playerIsAlive = true;
  }
  init() { }
  preload() { }

  create() {

    // create the player sprite    
    this.player = this.physics.add.sprite(200, 400, 'player').setSize(50, 128);
    this.player.setBounce(0); // our player will bounce from items
    this.player.setCollideWorldBounds(true); // don't go out of the map

    this.setupLevel();

    // player animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'stopLeft',
      frames: [{ key: 'player', frame: 2 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'stopRight',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });

    this.physics.add.collider(this.groundLayer, this.player);

    this.cursors = this.input.keyboard.createCursorKeys();


    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);

    //zoom
    this.zoom = .3;
    TweenMax.to(this, 2.5, { zoom: .6 });

    // LAVA! 
    this.physics.add.overlap(this.player, this.obstaclesLayer);
    // Tombstones!
    this.tombstones.forEach((tombstone) => {
      this.physics.add.collider(this.player, tombstone);
    });

    GravityController.setWorld(this.physics.world);
  }

  setupLevel() {
    this.map = this.add.tilemap('level');
    const tileset = this.map.addTilesetImage('tiles', 'gameTiles');
    this.groundLayer = this.map.createStaticLayer('walls', tileset);


    // the player will collide with this layer
    this.groundLayer.setCollisionByExclusion([-1]);

  
    this.obstaclesLayer = this.map.createStaticLayer('obstacles', tileset);

    //sets what kills you
    this.obstaclesLayer.setTileIndexCallback([7,8,9,10,11], (sprite) => {
      this.die(sprite);
    });

    this.tombstones = [];
    this.ghosts = this.physics.add.staticGroup();
    this.takenBlocks = [];

    this.goal = this.physics.add.sprite(this.groundLayer.width - 128, 900, 'flag')
      .setSize(84, 145).setImmovable()
      .setOffset(0, -18);
    this.goal.setCollideWorldBounds(true);
    this.physics.add.collider(this.groundLayer, this.goal);

    this.physics.add.overlap(this.player, this.goal, this.win);

    this.physics.add.overlap(this.player, this.ghosts, (sprite) =>{
      this.die(sprite);
    });

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
  }

  win() {
    WinScreen.show();
  }

  die(sprite){
     // The Death, of Playerman
     if (this.playerIsAlive) {
      this.player.visible = false;
      //UserInfo.setDeath([Math.ceil(sprite.x / TILE_SIZE), Math.ceil(sprite.y / TILE_SIZE)]);
      this.playerIsAlive = !this.playerIsAlive;
      this.sound.play('death');
      setTimeout(() => {
        // DeathMenu.show();
      }, 2100);
    }
  }

  update() {
    if (!this.playerIsAlive) return;

    if (this.cursors.left.isDown) // if the left arrow key is down
    {
      this.player.body.setVelocityX(-WALK_SPEED); // move left
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) // if the right arrow key is down
    {
      this.player.body.setVelocityX(WALK_SPEED); // move right
      this.player.anims.play('right', true);
    } else {
      if (this.player.body.velocity.x > 0) {
        this.player.anims.play('stopRight', true);
      }
      else if (this.player.body.velocity.x < 0) {
        this.player.anims.play('stopLeft', true);
      }
      this.player.body.setVelocityX(0);
    }

    this.player.body.rotation = (90 * -GravityController.getGravityMultiplier().y) + (90 * -GravityController.getGravityMultiplier().x);

    if ((this.cursors.space.isDown || this.cursors.up.isDown) && (this.player.body.overlapY || this.player.body.onFloor())) {
      this.player.body.setVelocityY(GravityController.getGravityMultiplier().y * -600); // jump up
      this.sound.play('jump');
    }
    this.cameras.main.zoom = this.zoom;
  }
}
