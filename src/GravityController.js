class GravityController {
    constructor(){
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
        this.world.gravity.y = -this.world.gravity.y;
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
     * let me get that world
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * gives a positive or negative number (the number is 1) for x and y gravity.
     */
    getGravityMultiplier() {
        return {x: this.world.gravity.x > 0 ? 1 : -1 , y: this.world.gravity.y > 0 ? 1 : -1}
    }
};

export default new GravityController();