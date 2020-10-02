/* globals __DEV__ */
import Phaser from 'phaser'
import GravityController from '../GravityController';
import LevelManager from '../LevelManager';
import { TweenMax } from "gsap";

const TILE_SIZE = 128;
const WALK_SPEED = 300;
const JUMP_HEIGHT = 720;

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }
  init() { 
    this.playerIsAlive = true;
    LevelManager.setScene(this);
  }
  preload() { }

  create() {
    // create the player sprite    
    this.player = this.physics.add.sprite(200, 400, 'player').setSize(50, 128)
    
    this.player.setBounce(0); // our player will bounce from items
    this.player.setCollideWorldBounds(true); // don't go out of the map
    
    this.setupLevel();

    this.children.bringToTop(this.player);

    // player animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 5 }),
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

    GravityController.setWorld(this.physics.world);
    GravityController.setCameras(this.cameras);
  }

  setupLevel() {
    let customPipeline;

    if(!this.game.renderer.hasPipeline('GlowFilter')){
      customPipeline = this.plugins.get('rexGlowFilterPipeline').add(this, 'GlowFilter');
    } else {
      customPipeline = this.game.renderer.getPipeline('GlowFilter')
    }

    this.tweens.add({
      targets: customPipeline,
      intensity: 0.03,
      ease: 'Linear',
      duration: 600,
      repeat: -1,
      yoyo: true,
    });

    LevelManager.getLevel()
    this.map = this.add.tilemap(LevelManager.getLevel());
    const tileset = this.map.addTilesetImage('tiles', 'gameTiles');
    const backgroundTileset = this.map.addTilesetImage('backgroundTiles', 'backgroundTiles');
    const gravTimer = LevelManager.getGravInterval();

    this.backgroundLayer = this.map.createStaticLayer('background', backgroundTileset);
    this.groundLayer = this.map.createStaticLayer('walls', tileset);

    const objectsLayer = this.map.getObjectLayer('Objects')['objects'];

    objectsLayer.forEach(object => {
      switch (object.type) {
        case "goal":
          this.goal = this.physics.add.staticSprite(object.x, object.y+96, 'hole')
            .setSize(226, 187)
          break;
        case "player":
          //this.player.setPosition(object)
          break;
      }
    });



    // the player will collide with this layer
    this.groundLayer.setCollisionByExclusion([-1]);
    this.obstaclesLayer = this.map.createStaticLayer('obstacles', tileset).setPipeline('GlowFilter');

    this.groundLayer.setCollisionByProperty({ collides: true });

    this.physics.add.overlap(this.player, this.obstaclesLayer);

    //sets what kills you
    this.obstaclesLayer.setTileIndexCallback([7, 8, 9, 10, 11], (sprite) => {
      this.die();
    });

    const makeTrash = 120;
    const trashArray = [];
    const spread = 3000;
    const trashOptions = ['paper']
    for (let i = 0; i < makeTrash; i += 1) {
      const todaysTrash = trashOptions[Math.floor(Math.random() * trashOptions.length)];
      trashArray.push(
        this.physics.add.sprite(Math.random() * spread, Math.random() * spread, todaysTrash)
      )
      trashArray[i].setScale(Math.random() / 2)
      this.physics.add.collider(this.groundLayer, trashArray[i]);
    }

    GravityController.setTrash(trashArray)
    GravityController.setPlayer(this.player)

    // this.physics.add.collider(this.groundLayer, this.goal);


    this.physics.add.overlap(this.player, this.goal, this.win.bind(this));

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // set timer for gravity change
    this.gravInterval = setInterval(()=>{
      GravityController.flip();
    }, gravTimer);
  }

  win() {
    clearInterval(this.gravInterval);
    LevelManager.nextLevel(this.scene);
  }

  die() {
    if (this.playerIsAlive) {
      this.player.visible = false;
      this.playerIsAlive = !this.playerIsAlive;
      this.sound.play('death');

      setTimeout(() => {
        clearInterval(this.gravInterval);
        this.playerIsAlive = !this.playerIsAlive;
        this.scene.restart();
      }, 1000);
    }
  }

  update() {
    if (!this.playerIsAlive) return;
    const gravDirection = GravityController.getGravityMultiplier().y > 0;

    if (this.cursors.left.isDown) // if the left arrow key is down
    {
      this.player.body.setVelocityX(-WALK_SPEED); // move left
      this.player.anims.play('left', true);
      this.player.scaleX = gravDirection ? -1 : 1;
    }
    else if (this.cursors.right.isDown) // if the right arrow key is down
    {
      this.player.body.setVelocityX(WALK_SPEED); // move right
      this.player.anims.play('right', true);
      this.player.scaleX = gravDirection ? 1 : -1;
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

    if ((this.cursors.space.isDown || this.cursors.up.isDown) && (this.player.body.overlapY || this.player.body.onFloor() || this.player.body.onCeiling())) {
      this.player.body.setVelocityY(GravityController.getGravityMultiplier().y * -JUMP_HEIGHT); // jump up
      this.sound.play('jump');
    }

    this.cameras.main.zoom = this.zoom;
  }
}
