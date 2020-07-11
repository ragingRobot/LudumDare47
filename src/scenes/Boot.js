import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
    this.add.text(100, 100, 'loading fonts...')

    this.load.tilemapTiledJSON('level', 'assets/levels/level.json');
    this.load.image('gameTiles', 'assets/images/tiles.png');
    this.load.spritesheet('player', 'assets/images/guy.png', { frameWidth: 128, frameHeight: 128 });
    // this.load.image('loaderBg', '.assets/images/loader-bg.png')
    this.load.image('background', 'assets/images/background.png')
    this.load.image('tombstone', 'assets/images/tombstone.png');
    this.load.image('flag', 'assets/images/flag.png');
    this.load.image('trash', 'assets/images/trash.png');
    this.load.image('ghost', 'assets/images/ghost.png');

    this.load.audio('jump', 'assets/sounds/jump.wav');
    this.load.audio('death', 'assets/sounds/death.wav');
    
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })
  }

  update () {
    if (this.fontsReady /*&& this.load.cacheManager.custom.dead*/) {
      this.scene.start('SplashScene')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
