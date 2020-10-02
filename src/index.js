import Phaser from 'phaser'

import BootScene from './scenes/Boot'
import SplashScene from './scenes/Splash'
import GameScene from './scenes/Game'
import GlowFilterPipelinePlugin from 'phaser3-rex-plugins/plugins/glowfilterpipeline-plugin.js';

import config from './config'

const introBox = document.getElementsByClassName("intro")[0];


const gameConfig = Object.assign(config, {
  scene: [BootScene, SplashScene, GameScene],
  plugins: {
    global: [{
        key: 'rexGlowFilterPipeline',
        plugin: GlowFilterPipelinePlugin,
        start: true
    }]
  }
})

class Game extends Phaser.Game {
  constructor () {
    super(gameConfig)
  }
}
document.getElementById("startButton").addEventListener("click", (e) => {
  e.preventDefault();
  introBox .classList.add("hide");
});

window.game = new Game();

