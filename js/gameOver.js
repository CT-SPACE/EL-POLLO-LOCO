/**
 * Handles the Classes for other Elements on the Screen during GameOver-Session
 * @param {HTMLElement} gameOverScreen
 */
function prepareGameOverScreenStyles(gameOverScreen) {
  let stayHeadline = document.getElementById("stayHeadline");
  stayHeadline.classList.remove("headline");
  gameOverScreen.classList.remove("displayNone");
  gameOverScreen.classList.add("winningGameOverBG");
  document.getElementById("playControl").style.display = "none";
  let playScreen = document.getElementById("playScreen");
  playScreen.style.border = "unset";
  playScreen.style.boxShadow = "unset";
  let canvas = document.getElementById("canvas");
  canvas.classList.add("displayNone");
}

/**
 * Makes the GameOverScreen visible and returns which Screen will be shown - Winning Pepe or Winning Endboss
 * @param {string} deathCandidate
 * @returns
 */
function showGameOverScreen(deathCandidate) {
  let gameOverScreen = document.getElementById("gameOverScreen");
  prepareGameOverScreenStyles(gameOverScreen);
  document.querySelectorAll(".control, .button").forEach((element) => {
    element.classList.add("visibilityHidden");
    handleDeathCandidates(deathCandidate, gameOverScreen);
  });
}

/**
 * Decides which GameOverScreen will be shown - Winning Pepe or Winning Endboss
 * @param {String} deathCandidate 
 * @param {HTMLElement} gameOverScreen 
 * @returns 
 */
function handleDeathCandidates(deathCandidate, gameOverScreen) {
  if (deathCandidate === "Pepe") {
    handleWinningEndboss(gameOverScreen);
  } else if (deathCandidate === "Endboss") {
    handleWinningPepe(gameOverScreen);
  } else return;
}

/**
 * Adds the ReplayButton to the GameOverScreen
 * @param {HTMLElement} gameOverScreen
 * @param {boolean} status
 */
function includeReplayButton(gameOverScreen, status) {
  let replayPosition = replayButtonPosition(gameOverScreen, status);
  changeCTAForReplayButton(replayPosition, status);
  localStorage.setItem("autostart", "1");
}

/**
 * Creates the Div for the ReplayButton and sets its position.
 * @param {HTMLElement} gameOverScreen
 * @param {String} status
 */
function replayButtonPosition(gameOverScreen, status) {
  let oldRetry = gameOverScreen.querySelector("#retryPosition");
  if (oldRetry) oldRetry.remove();
  replayPosition = document.createElement("div");
  replayPosition.id = "retryPosition";
  replayPosition.classList.add("retryPosition");
  replayPosition.classList.add(status === "win" ? "justSpaceBetween" : "justRight");
  gameOverScreen.appendChild(replayPosition);
  return replayPosition;
}

/**
 * Creates a div element for the replay button and sets its id and class based on the game status.
 * It adds an event listener to the replay button that restarts the game when clicked.
 * @param {HTMLElement} replayPosition
 * @param {String} status
 */
function changeCTAForReplayButton(replayPosition, status) {
  let oldReplay = document.getElementById("retry");
  if (oldReplay) oldReplay.remove();
  let replay = document.createElement("div");
  replay.id = "retry";
  replay.classList.add("replayButton", status === "lose" ? "lose" : "win");
  replay.addEventListener("click", initReStart);
  replayPosition.appendChild(replay);
}

/**
 * Creates the container for the Loosing Message and starts the replay-Button
 * @param {HTMLElement} gameOverScreen
 */
function handleWinningEndboss(gameOverScreen) {
  if (getSoundStatus()) {
    audioManager.playAudio("pepe_loses", { play: true, volume: 0.3 });
  }
  changeStylesForWinningEndboss(gameOverScreen);
}

/**
 * Prepares the GameOverScreen for winning Endboss
 * @param {HTMLElement} gameOverScreen
 */
function changeStylesForWinningEndboss(gameOverScreen) {
  gameOverScreen.innerHTML = "";
  gameOverScreen.classList.add("backdrop");
  gameOverScreen.appendChild(gameOverTextForWinningEndboss());
  includeReplayButton(gameOverScreen, "lose");
  gameOverScreen.appendChild(pepeGrave());
}

/**
 * Helper function to create the GameOverText für handleWinningEndboss()
 * @description Creates the GameOverText and returns it as a div element.
 * @returns gameOverText
 */
function gameOverTextForWinningEndboss() {
  let gameOverText = document.createElement("div");
  gameOverText.className = "gameOverText";
  gameOverText.innerHTML = `<h3>¡Game Over!</h3>Oh no, Pepe perdió contra <br> este oponente devastador!`;
  return gameOverText;
}

/**
 * Helper function to create the Pepe's Grave for handleWinningEndboss()
 * @description Creates a div element with the id "grave" and class "pepeGrave", which contains an image of Pepe's grave.
 * @returns pepeGrave;
 */
function pepeGrave() {
  let pepeGrave = document.createElement("div");
  pepeGrave.id = "grave";
  pepeGrave.className = "pepeGrave";
  pepeGrave.innerHTML = `<img src="./img/pepe_grab.svg" alt="Pepe's Grave">`;
  return pepeGrave;
}

/**
 * Creates the container for the winning Message and starts the replay Button
 * @param {HTMLElement} gameOverScreen
 */
function handleWinningPepe(gameOverScreen) {
  gameOverScreen.innerHTML = "";
  soundStatusForHandleWinningPepe();
  addGameOverTextToGameOverScreen(gameOverScreen);
  let rueda = addRotatingRoastEndboss(gameOverScreen);
  setTimeout(() => {
    rueda.classList.add("big");
    addScoreContainerAndReplayButton(gameOverScreen);
  }, 60);
}

/**
 * Plays the winning sound for Pepe if the sound is enabled.
 */
function soundStatusForHandleWinningPepe() {
  if (getSoundStatus()) {
    audioManager.playAudio("pepe_wins", { play: true, volume: 0.3 });
  }
}

/**
 * Adds the GameOverText to the GameOverScreen for winning Pepe.
 * It creates a div element with the class "gameOverText" and appends it to the gameOverScreen.
 * @param {HTMLElement} gameOverScreen
 */
function addGameOverTextToGameOverScreen(gameOverScreen) {
  if (!gameOverScreen.querySelector(".gameOverText")) {
    const textDiv = document.createElement("div");
    textDiv.className = "gameOverText";
    textDiv.innerHTML = `<h3>YOU WON!</h3> ¡Que Aproveches!`;
    gameOverScreen.appendChild(textDiv);
  }
}

/**
 * Adds a rotating roast endboss image to the gameOverScreen.
 * @param {HTMLElement} gameOverScreen
 * @param {HTMLElement} rueda
 */
function addRotatingRoastEndboss(gameOverScreen) {
  rueda = document.createElement("div");
  rueda.classList.add("winningBG");
  gameOverScreen.appendChild(rueda);
  return rueda;
}

/**
 * Helper function to rotate the roast endboss for winning Pepe.
 * It adds a class to the rueda element and includes the replay button and the .
 * @param {HTMLElement} gameOverScreen
 */
function addScoreContainerAndReplayButton(gameOverScreen) {
  includeReplayButton(gameOverScreen, "win");
  handleScoreContainer(gameOverScreen);
}

/**
 * Handles the ScoreContainer for the GameOverScreen
 * @description Creates a div element with the class "scoreContainer" and adds the final score and highscore to it.
 */
function handleScoreContainer(gameOverScreen) {
  let retryContainer = document.getElementById("retryPosition");
  let scoreContainer = document.createElement("div");
  scoreContainer.classList.add("scoreContainer");
  finalScore = world.highscoreManager.currentScore;
  compareFinalScoreWithHighscore(scoreContainer, gameOverScreen);

  retryContainer.insertBefore(scoreContainer, retryContainer.firstChild);
  world.highscoreManager.saveHighscore();
}

function compareFinalScoreWithHighscore(scoreContainer, gameOverScreen) {
  if (finalScore > savedHighscore) {
    handleHigherFinalScore(scoreContainer, finalScore, savedHighscore);
    gameOverScreen.classList.add("starsBG");
  } else {
    handleLowerFinalScore(scoreContainer, finalScore, savedHighscore);
  }
}

/**
 * In Case of a higher final score, this function handles the display of the new highscore and the old highscore.
 * @param {Object} scoreContainer
 * @param {HTMLElement} finalScore
 * @param {HTMLElement} savedHighscore
 */
function handleHigherFinalScore(scoreContainer, finalScore, savedHighscore) {
  scoreContainer.classList.add("newHighscore");
  scoreContainer.innerHTML = `
    <div class="highscore"><h4>NEW HighScore:</h4> ${finalScore}</div>
    <div class="score"><h4>old Highscore:</h4> ${savedHighscore}</div>
  `;
}

/**
 * In Case of a lower final score than Highscore, this function handles the display of the final score and the highscore.
 * @param {Object} scoreContainer
 * @param {HTMLElement} finalScore
 * @param {HTMLElement} savedHighscore
 */
function handleLowerFinalScore(scoreContainer, finalScore, savedHighscore) {
  scoreContainer.innerHTML = `
    <div class="score"><h4>Your Score:</h4> ${finalScore}</div>
    <div class="highscore"><h4>Highscore:</h4> ${savedHighscore}</div>
  `;
}
