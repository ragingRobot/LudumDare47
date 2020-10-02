import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
  }

  create () {
    this.scene.start('GameScene')
  }

  update () {}
}
