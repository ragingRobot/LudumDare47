/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'IntermissionScene' })
  }

  preload () {
  }

  create () {
    this.scene.get('IntermissionScene').events.on('wake', () => {
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, eff) => {
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, eff) => {
          this.scene.bringToTop('GameScene')
          this.scene.wake('GameScene')
          this.cameras.main.fadeIn(0,0,0,0) //reset camera
          this.scene.sleep();
        });
        this.cameras.main.fadeOut(2000, 0, 0, 0)
      });
    })
    this.cameras.main.setBackgroundColor('black')
    this.cameras.main.fadeIn(2000, 0, 0, 0)

    const relativeSpace = this.cameras.main.getWorldPoint(50, 58)
    this.text = this.add.text(relativeSpace.x, relativeSpace.y)
    this.text.setText("Another day has passed...") 
    this.text.setFontSize(18)
  }

  update () {
    

  }
}
