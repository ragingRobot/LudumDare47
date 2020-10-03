/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../gameObjects/Player'
import LevelManager from '../LevelManager';
import { TweenMax } from "gsap";
import NonPlayer from '../gameObjects/NonPlayer';
import Enemy from '../gameObjects/Enemy';

const ANIMATION_FRAME_RATE = 10
export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.ObjectsToUpdate = [];
  }
  init() {
    LevelManager.setScene(this);
  }

  create() {
    // create the player sprite    
    this.player = new Player(this);
    this.player.scale = 3; //scaled up from low-res sprite, we can just make larger sprites if needed 
    
    // Player Animations
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {start: 0, end: 2}),
      frameRate: ANIMATION_FRAME_RATE,
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {start: 3, end: 5}),
      frameRate: ANIMATION_FRAME_RATE,
    
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {start: 6, end: 8}),
      frameRate: ANIMATION_FRAME_RATE,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {start: 39, end: 41}),
      frameRate: ANIMATION_FRAME_RATE,
    });
    
    
    
    this.setupLevel();

    this.children.bringToTop(this.player);

    this.physics.add.collider(this.groundLayer, this.player);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);

    //zoom
    this.zoom = .3;
    TweenMax.to(this, 2.5, { zoom: .6 });
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
          this.player.x = object.x;
          this.player.y = object.y;
          break;
        case "npc":
          const npc = new NonPlayer(this);
          npc.x = object.x;
          npc.y = object.y;
          this.ObjectsToUpdate.push(npc);
          break;

        case "enemy":
          const enemy = new Enemy(this);
          enemy.x = object.x;
          enemy.y = object.y;
          this.ObjectsToUpdate.push(enemy);
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
      this.player.die();
    });

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
  }

  update() {
    this.cameras.main.zoom = this.zoom;
    this.player.update();
    this.ObjectsToUpdate.forEach((item)=>{
      item.update();
    })
  }
}
