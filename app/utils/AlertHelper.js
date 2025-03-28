export class AlertHelper {
    static dropDown;
    static onClose;
  
    static setDropDown(dropDown) {
      this.dropDown = dropDown;
    }
  
    static show(type, title, message) {
      if (this.dropDown) {
        this.dropDown.alertWithType(type, title, message);
      }
    }
    static showWithActions(type, title, message, actions) {
      if (this.dropDown && this.dropDown.alertWithActions) {
        this.dropDown.alertWithActions(type, title, message, actions);
      }
    }
    static setOnClose(onClose) {
      this.onClose = onClose;
    }
  
    static invokeOnClose() {
      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  }