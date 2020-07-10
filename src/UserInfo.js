class UserInfo {
    constructor() {
        this.name = localStorage.getItem('name');
        this.death = localStorage.getItem('death');
        this.location = [];
    }

    setName(name) {
        if(!this.name){
            this.name = name;
            localStorage.setItem('name', name);
        }
    }

    getName() {
        return this.name;
    }

    setDeath(loc) {
        localStorage.setItem('death', true);
        this.location = loc;
    }

    getDeath() {
        return this.death;
    }

    getDeathLocation() {
        return this.location;
    }
}
export default new UserInfo();
