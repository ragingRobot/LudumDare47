import Phaser from 'phaser'

import BootScene from './scenes/Boot'
import SplashScene from './scenes/Splash'
import GameScene from './scenes/Game'
import UserInfo from './UserInfo'

import config from './config'

const introBox = document.getElementsByClassName("intro")[0];
const nameBox = document.getElementById("name");
const alreadyPlayed = document.getElementsByClassName("alreadyPlayed")[0];
const newUser = document.getElementsByClassName("newUser")[0];
const userName = document.getElementsByClassName("userName")[0];

const gameConfig = Object.assign(config, {
  scene: [BootScene, SplashScene, GameScene]
})

class Game extends Phaser.Game {
  constructor () {
    super(gameConfig)
  }
}

if(UserInfo.getDeath()){
  newUser.classList.add("hide");
  alreadyPlayed.classList.remove("hide");
  userName.innerHTML = UserInfo.getName();
} else {
  nameBox.value = UserInfo.getName();
  newUser.classList.remove("hide");
  document.getElementById("startButton").addEventListener("click", (e) => {
    e.preventDefault();
    const value = nameBox.value;
    if(value){
      UserInfo.setName(value);
      introBox .classList.add("hide");
      window.game = new Game();
    }
  });
}

