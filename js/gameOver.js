

/**
 * Handles the Classes for other Elements on the Screen during GameOver-Session
 * @param {HTMLElement} gameOverScreen 
 */
function prepareGameOverScreen(gameOverScreen) {
  let stayHeadline = document.getElementById("stayHeadline");
  stayHeadline.classList.remove("headline");
  gameOverScreen.classList.remove("displayNone");
  gameOverScreen.classList.add("winningGameOverBG");
  document.getElementById("playControl").style.display = "none";
  let playScreen = document.getElementById("playScreen")
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
  prepareGameOverScreen(gameOverScreen);
  document.querySelectorAll(".control, .button").forEach((element) => {
    element.classList.add("visibilityHidden");
  });

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
  let replayPosition = document.createElement("div");
  replayPosition.id = "retryPosition";
  replayPosition.classList.add("retryPosition");
  replayPosition.classList.add(status === "win" ? "justSpaceBetween" : "justRight");
  localStorage.setItem("autostart", "1");
  let replay = document.createElement("div");
  replay.id = "retry";
  replay.classList.add("replayButton", status === "lose" ? "lose" : "win");
  replay.addEventListener("click", () => {
    reStart();
  });
  replayPosition.appendChild(replay);   
  gameOverScreen.appendChild(replayPosition);
}

/**
 * Creates the container for the Loosing Message and starts the replay-Button
 * @param {HTMLElement} gameOverScreen 
 */
function handleWinningEndboss(gameOverScreen) {
    if(getSoundStatus()){
      audioManager.playAudio("pepe_loses", { play: true, volume: 0.3 });
    }
  gameOverScreen.innerHTML = "";
  gameOverScreen.classList.add("backdrop");
  gameOverScreen.appendChild(gameOverText());
  includeReplayButton(gameOverScreen, "lose");
  gameOverScreen.appendChild(pepeGrave());
}

/**
 * Helper function to create the GameOverText für handleWinningEndboss()
 * @description Creates the GameOverText and returns it as a div element. 
 * @returns gameOverText
 */
function gameOverText(){
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
function pepeGrave(){
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
  if(getSoundStatus()){
  audioManager.playAudio("pepe_wins", { play: true, volume: 0.3 });
  }
  gameOverScreen.innerHTML += ` <div class="gameOverText"><h3>YOU WON!</h3> ¡Que Aproveches! </div>`;
  let rueda = document.createElement("div");
  rueda.classList.add("winningBG");
  gameOverScreen.appendChild(rueda);
  setTimeout(() => {
    rueda.classList.add("big");
    includeReplayButton(gameOverScreen, "win");  
    handleScoreContainer(gameOverScreen);
  }, 10);
}

/**
 * Handles the ScoreContainer for the GameOverScreen
 * @description Creates a div element with the class "scoreContainer" and adds the final score and highscore to it.
 */
function handleScoreContainer(gameOverScreen){
  let retryContainer = document.getElementById("retryPosition");
  let scoreContainer = document.createElement("div");
  scoreContainer.classList.add("scoreContainer");
  finalScore = window.highscoreManager.currentScore;
  if (finalScore > savedHighscore) {
  handleHigherFinalScore(scoreContainer, finalScore, savedHighscore);
  gameOverScreen.classList.add("starsBG");
  } else {
     handleLowerFinalScore(scoreContainer, finalScore, savedHighscore);
  }
retryContainer.insertBefore(scoreContainer, retryContainer.firstChild);
   window.highscoreManager.saveHighscore();
}

/**
 * In Case of a higher final score, this function handles the display of the new highscore and the old highscore.
 * @param {Object} scoreContainer 
 * @param {HTMLElement} finalScore 
 * @param {HTMLElement} savedHighscore 
 */
function handleHigherFinalScore(scoreContainer, finalScore, savedHighscore){
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
function handleLowerFinalScore(scoreContainer, finalScore, savedHighscore){
  scoreContainer.innerHTML = `
    <div class="score"><h4>Your Score:</h4> ${finalScore}</div>
    <div class="highscore"><h4>Highscore:</h4> ${savedHighscore}</div>
  `;
}