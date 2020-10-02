class GravityController {
    constructor(){
        this.player = null;
        this.trash = null;
        this.world = null;

        //for testing just call GravityController.flip() in the console to test
        window.GravityController = this;
    }

    /**
     * makes the floor the roof and the roof the floor
     */
    flip() {
        if(!this.world){
            console.warn("You need to call GravityController.setWorld");
            return;
        }
        this.trash.forEach((t) => {
            t.body.setGravityY(-this.world.gravity.y)  // Make the trash have no gravity relative to the world
            t.body.setVelocityY(Math.random() * 150 * -(this.world.gravity.y/Math.abs(this.world.gravity.y))) // give it a kick!
        })
        
        this.player.body.setGravityY(-this.world.gravity.y)
        this.player.body.setVelocityY(Math.random() * 80 * -(this.world.gravity.y/Math.abs(this.world.gravity.y)))
        
        this.shake();

        setTimeout(()=>{
            this.world.gravity.y = -this.world.gravity.y;
            
            this.trash.forEach((t) => {
                t.body.setGravityY(this.world.gravity.y) //Reset Gravity
            })
        }, 1000)
    }

     /**
     * makes the wall the floor and the roof the wall
     */
    rotate() {
        if(!this.world){
            console.warn("You need to call GravityController.setWorld");
            return;
        }
        const {x, y} = this.world.gravity;
        this.world.gravity.y = x;
        this.world.gravity.x = y;
    }

    /**
     * let me get that playa
     */
    setPlayer(player){
        this.player = player;
    }
    
    /**
     * let me get that trash
     */
    setTrash(trash){
        this.trash = trash;
    }

    /**
     * let me get that world
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * let me get that cameras
     */
    setCameras(cameras) {
        this.cameras = cameras;
    }

    /**
     * my milkshake brings all the boys to the yard
     */
    shake() {
        this.cameras.main.shake(400, 0.012, false, (camera, progressAmount) => {
          this.isShaking = progressAmount < 1;
        });
      }

    /**
     * gives a positive or negative number (the number is 1) for x and y gravity.
     */
    getGravityMultiplier() {
        return {x: this.world.gravity.x > 0 ? 1 : -1 , y: this.world.gravity.y > 0 ? 1 : -1}
    }
};

export default new GravityController();