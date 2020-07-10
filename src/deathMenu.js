import UserInfo from './UserInfo'
import {saveDeadPlayer} from './utils'
class DeathMenu {
    show(){
        document.getElementsByClassName("death")[0].classList.remove("hide");
        document.getElementById("hauntButton").addEventListener("click", this.saveSelection.bind(this, "ghost"))
        document.getElementById("helpButton").addEventListener("click", this.saveSelection.bind(this, "tombStone"))
    }
    saveSelection(option){
        saveDeadPlayer(UserInfo.getName(), UserInfo.getDeathLocation() ,option);
        document.getElementsByClassName("deathSelection")[0].classList.add("hide");
        document.getElementsByClassName("end")[0].classList.remove("hide");
    }
}

export default new DeathMenu();