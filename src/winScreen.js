import UserInfo from './UserInfo'
import {saveDeadPlayer} from './utils'
class WinScreen {
    show(){
        document.getElementsByClassName("win")[0].classList.remove("hide");
    }
}

export default new WinScreen();