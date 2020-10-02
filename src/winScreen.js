class WinScreen {
    show(){
        document.getElementsByClassName("win")[0].classList.remove("hide");
    }
}

export default new WinScreen();