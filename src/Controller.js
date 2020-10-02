class Controller {
  constructor() {
    this.action1 = false;
    this.action2 = false;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    this.addEventsToButton(".jump", "action2");
    this.addEventsToButton(".shoot", "action1");
    this.addEventsToButton(".up", "up");
    this.addEventsToButton(".down", "down");
    this.addEventsToButton(".left", "left");
    this.addEventsToButton(".right", "right");


    if ("ontouchstart" in document.documentElement) {
      document.querySelector(".controls").classList.remove("hide");
    }
  }

  toggle(name, value) {
    this[name] = value;
  }

  addEventsToButton(selector, toggle) {
    document.querySelector(selector).addEventListener("touchstart", this.toggle.bind(this, toggle, true));
    document.querySelector(selector).addEventListener("touchend", this.toggle.bind(this, toggle, false));
  }

}

export default new Controller();
