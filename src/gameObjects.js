class GameObject {
  constructor(){
    this.damage = 0;
    this.hasPhysics = true;
    this.isActive = false;
    this.isStatic = true;
    this.position = {}
  }
}



export class Spikes extends GameObject {
  constructor(){}
}