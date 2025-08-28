/**
 * Initializes the restart functionality for the game.
 * This function sets up the event listener for the "Replay"-Button during the Game and on GameOver screen
 */
function initReStart() {
  killOldWorld();
  reStart();
}

/**
 * Restarts the game directly and ready to play.
 * This function is called when the user clicks the "Go Home" button.
 */
async function reStart() {
  restart = true;
  await initLevel();
  await playConditions();
  resetGameOverScreen();
  resetButtons();
  restoreSoundStatus();
  resetGame();
  keyboard = new Keyboard();
}

/**
 * Resets the game parameters to their initial state.
 * This function is called when the game is restarted.
 */
function resetGame() {
  keyboardEnabled = true;
  EndBossClose = false;
  EndBossVisible = false;
  gamePaused = false;
  gamePausedByUser = false;
  touchSetupDone = false;
}

/**
 * Deletes the existing World-Class and Character instances.
 *
 */
function killOldWorld() {
  Level01 = null;
  audioManager.stopAllSounds();
  worldToNull();
  removeKeyboardEvents();
}

/**
 * Sets the world variable to null and clears all intervals and references.
 */
function worldToNull() {
  if (world) {
    allIntervals.forEach(clearInterval);
    allIntervals = [];
    world.stopAllAnimations();
    world.throwableObjects = [];
    world.enemies = [];
    world.statusBarPepe = null;
    world.statusBarCoin = null;
    world.statusBarChilli = null;
    world.statusBarEndboss = null;
    world.background_static = null;
    world.minichicken = null;
    world.character = null;
    world.endbossOfEnemies = null;
    world.highscoreManager = null;
    world.canvas = null;
  }
  world = null;
}

/**
 * Removes keyboard event listeners to prevent multiple bindings.
 */
function removeKeyboardEvents() {
  document.removeEventListener("keyup", handleKeyUp);
  document.removeEventListener("keydown", (e) => {
    world.character.setLastKeyPressTime(e);
    handleKeyDown(e);
  });
}

/**
 * Emptys the GameOverScreen and resets its styles.
 * This function is called when the game is restarted.
 */
function resetGameOverScreen() {
  let gameOverScreen = document.getElementById("gameOverScreen");
  gameOverScreen.classList.add("displayNone");
  gameOverScreen.classList.remove("winningGameOverBG", "backdrop", "losingGameOverBG", "starsBG");
  gameOverScreen.innerHTML = "";
}

/**
 * Resets the visibility of control buttons and the play control.
 * This function is called when the game is restarted.
 */
function resetButtons() {
  document.querySelectorAll(".control, .button").forEach((element) => {
    element.classList.remove("visibilityHidden");
  });
  document.getElementById("playControl").style.display = "flex";
  canvas.classList.remove("displayNone");
}

/**
 * Sets an interval and stores its ID in the allIntervals array for later clearing.
 * @param {String} id 
 * @param {Date} time 
 */
function intervalsToStop(id, time) {
  let interval = setInterval(id, time);
  allIntervals.push(interval);
}
