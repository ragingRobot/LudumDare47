import Phaser from 'phaser'

export default {
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'content',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 1000 },
        debug: false
    }
  },
  localStorageName: 'phaseres6webpack'
}
