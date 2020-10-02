import WinScreen from './winScreen'
import GameScene from './scenes/Game'
class LevelManager {
    constructor() {
        this.levels = ['level', 'level1'];
        this.levelGravInterval = [5000, 7000];
        this.current = 0;
        this.reset = false;
    }

    setScene(scene) {
        this.scene = scene;
        this.reset = true;
    }

    /**
     * returns the current level file name
     */
    getLevel() {
        return this.levels[this.current];
    }

    getGravInterval() {
        return this.levelGravInterval[this.current];
    }
 
    nextLevel(scene) {
        if (this.reset) {
            if (this.current === this.levels.length-1) {
                WinScreen.show();
            }
            this.current++;
            scene.stop('GameScene');
            scene.start('GameScene');
        }
    }
}

export default new LevelManager();