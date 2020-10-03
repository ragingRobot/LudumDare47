import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
    this.add.text(100, 100, 'loading...')

    this.load.tilemapTiledJSON('level1', 'assets/levels/level1.json');
    this.load.tilemapTiledJSON('level', 'assets/levels/level.json');
    
    this.load.image('gameTiles', 'assets/images/tiles-extruded.png');
    this.load.spritesheet('player', 'assets/images/sprite-example.png', { frameWidth: 48, frameHeight: 48 });
    this.load.image('backgroundTiles', 'assets/images/background.png')
    this.load.image('hole', 'assets/images/mousehole.png');
    this.load.image('paper', 'assets/images/trash-paper.png');

    this.load.audio('backgroundMusic', 'assets/sounds/prison-yard.mp3');
    this.load.audio('jump', 'assets/sounds/jump.wav');
    this.load.audio('death', 'assets/sounds/death.wav');
    this.load.audio('pain', 'assets/sounds/pain.wav');
    this.load.audio('pain-2', 'assets/sounds/pain-2.wav');
    this.load.audio('sword-hit', 'assets/sounds/sword-hit.wav');
    this.load.audio('greeting', 'assets/sounds/greeting.wav');
    
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })
  }

  update () {
    if (this.fontsReady) {
      this.scene.start('SplashScene')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
