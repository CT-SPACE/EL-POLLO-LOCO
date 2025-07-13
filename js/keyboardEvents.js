
/**
 * Both eventlistener are defining the Button on the keyboard that are used to control the game.
 */
document.addEventListener("keydown", (e) => {
  if (gamePaused) return;
  if (!keyboardEnabled) return;

  if (e.code == "Space") {
    keyboard.SPACE = true;
  }
  if (e.code == "ArrowRight") {
    keyboard.RIGHT = true;
  }
  if (e.code == "ArrowLeft") {
    keyboard.LEFT = true;
  }
  if (e.code == "ArrowUp") {
    keyboard.UP = true;
  }
  if (e.code == "ArrowDown") {
    keyboard.DOWN = true;
  }
  if (e.code == "KeyD") {
    if (!throwKeyDownTime) {
      throwKeyDownTime = Date.now();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code == "Enter") {
    keyboard.ENTER = false;
  }
  if (e.code == "Space") {
    keyboard.SPACE = false;
  }
  if (e.code == "ArrowRight") {
    keyboard.RIGHT = false;
    audioPlaying["pepe_pollo"] = false;
  }
  if (e.code == "ArrowLeft") {
    keyboard.LEFT = false;
  }
  if (e.code == "ArrowUp") {
    keyboard.UP = false;
  }
  if (e.code == "ArrowDown") {
    keyboard.DOWN = false;
  }
  if (e.code == "KeyD") {
    if (throwKeyDownTime) {
      throwKeyUpTime = Date.now();
      throwDuration = throwKeyUpTime - throwKeyDownTime;
      throwKeyDownTime = null;
      keyboard.THROW = true;
    }
  }
});


/**
 * Defines the Touch buttons for mobile Devices
 * @param {string} BTN 
 * @param {boolean} value 
 * @param {Event} event 
 * @returns 
 */
function goControl(BTN, value, event) {
   if (event && event.cancelable) { event.preventDefault();}
  if (gamePaused || !keyboardEnabled) return;
  switch (BTN) {
    case "RIGHT":
      keyboard.RIGHT = value;
      break;
    case "LEFT":
      keyboard.LEFT = value;
      break;
    case "JUMP":
      keyboard.UP = value;
      break;
    case "THROW":
      if (value) {
        if (!throwKeyDownTime) {  throwKeyDownTime = Date.now();        }
      } else {
        handleThrowKeyTime();
      }
      break;
  }
}

/**
 * Helper function for goControl()
 */
function handleThrowKeyTime(){
          if (throwKeyDownTime) {
          throwKeyUpTime = Date.now();
          throwDuration = throwKeyUpTime - throwKeyDownTime;
          throwKeyDownTime = null;
          keyboard.THROW = true;
        }
}