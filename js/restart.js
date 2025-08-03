/**
 * Restarts the game directly and ready to play.
 * This function is called when the user clicks the "Go Home" button.
 */
async function reStart() {  
  restart = true;

  await initLevel();
  await playConditions();
  resetGameOverScreen();
  resetButtons() ;

  restoreSoundStatus();
  resetGame();
  keyboard = new Keyboard();

}


/**
 * Resets the game parameters to their initial state.
 * This function is called when the game is restarted.
 */
function resetGame(){
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
  if(world){
    allIntervals.forEach(clearInterval);
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
  };
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
    world = null;
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

function intervalsToStop(code, time) {
let interval = setInterval(code, time);
allIntervals.push (interval) ;
}

