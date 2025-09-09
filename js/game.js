let keyboard = new Keyboard();
let audioManager = new AudioManager();

/**
 * Starts the Init-Function after the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

/**
 * Eventlistener for device format detection
 */
window.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("resize", function () {
    let turnDevice = document.getElementById("turnToLandscape");
    let contentbox = document.getElementById("contentbox");
    handlePortraitMode(turnDevice, contentbox);
  });
});

/**
 * Handle the device orientation and display the "turn your device" message if in portrait mode.
 * Hides the content box when in portrait mode.
 * @param {Object} turnDevice
 * @param {Object} contentbox
 */
function handlePortraitMode(turnDevice, contentbox) {
  if (isPortrait()) {
    turnDevice.classList.remove("displayNone");
    contentbox.style.display = "none";
  } else {
    turnDevice.classList.add("displayNone");
    contentbox.style.display = "";
  }
}

/**
 * Prepares the "turn your Device"-Screen
 * @returns {boolean}
 */
function isPortrait() {
  return window.innerHeight > window.innerWidth && window.innerWidth <= 960;
}

/**
 * Initialises the game by loading assets and showing the start screen.
 */
async function init() {
  await loadGameAssets();
  restoreSoundStatus();
  document.getElementById("sound").style.display = "";
  if (localStorage.getItem("autostart") === "true") {
    playConditions();
  } else {
    showStartScreen();
  }
}

/**
 * Starts the Preloading of all game assets.
 */
async function loadGameAssets() {
  await fastPreload();
  LoadingVisual();
  await preloadImages();
  await preloadAudio();
  await initLevel();
}

/**
 * Prepares the game by introducing the start screen, the audio and needed Buttons
 */
function showStartScreen() {
  startScreen = true;
  allAmbientSounds();
  hideLoader();
}

/**
 * Pauses the Game Sound and stopps the ambient sounds.
 */
function pauseGameSounds() {
  audioManager.setMuted(true);
  allAmbientSounds();
}

/**
 * Reactivates the Sound
 */
function resumeGameSounds() {
  audioManager.setMuted(false);
}
/**
 * Plays the ambient sound in a loop with a delay of 20 seconds between each play.
 * Uses a timer to schedule the next play after the current sound finishes.
 */
function playAmbient() {
  clearSoundTimer();
  audioManager.loadAudio("pepe_ambient", "./audio/pepe_ambient.mp3");
  audioManager.playAudio("pepe_ambient", { play: true, volume: 0.1 });
  ambientSoundTimer = setTimeout(playAmbient, 20000);
}

/**
 * Clears the ambient sound timer to stop the loop.
 */
function clearSoundTimer() {
  if (ambientSoundTimer !== null) {
    clearTimeout(ambientSoundTimer);
    ambientSoundTimer = null;
  }
}

/**
 * Reacts to the sound status stored in the localstorage and applies it to the corresponding buttons.
 */
function applySoundStatus(isOn) {
  let soundIcon = document.getElementById("on-off");
  if (isOn) {
    soundIsOn(soundIcon);
  } else {
    soundIsOff(soundIcon);
  }
}

/**
 * Helper function to set the sound status to "on" and update the UI accordingly.
 * @param {Object} soundIcon
 */
function soundIsOn(soundIcon) {
  soundIcon.classList.remove("soundOFF");
  soundIcon.classList.add("soundON");
  audioManager.setMuted(false);
  allAmbientSounds();
}

/**
 * Helper function to set the sound status to "off" and update the UI accordingly.
 * @param {Object} soundIcon
 */
function soundIsOff(soundIcon) {
  soundIcon.classList.remove("soundON");
  soundIcon.classList.add("soundOFF");
  audioManager.setMuted(true);
}

/**
 * Toggles the sound status between on and off, updates the local storage, and applies the new status to the UI.
 */
function toggleSound() {
  let isOn = !getSoundStatus();
  setSoundStatus(isOn);
  applySoundStatus(isOn);
}

/**
 * Restores the sound status from local storage and applies it to the UI.
 */
function restoreSoundStatus() {
  let isOn = getSoundStatus();
  applySoundStatus(isOn);
}

/**
 * Saves the sound status in the local storage.
 * @param {*} isOn
 */
function setSoundStatus(isOn) {
  localStorage.setItem("soundOn", isOn ? "true" : "false");
}

/**
 * Returns the sound status from local storage. If no value is set, it defaults to true.
 * @returns {boolean}
 */
function getSoundStatus() {
  const value = localStorage.getItem("soundOn");
  if (value === null) return true;
  return value === "true";
}

/**
 * Sets and resets the status of the play button.
 * It toggles the play/pause state and updates the UI accordingly.
 * @param {*} toggleSource Defines the source of the toggle action, e.g., "content" or "play".
 * @param {*} value The value adds a condition to the toggle source to distinguish between play source with the value true or false
 */
function togglePlay(toggleSource, value) {
  let playDiv = document.getElementById("play");
  let playIcon = document.getElementById("switch");
  let reloadDiv = document.getElementById("gohome");
  controlContentStatus(playDiv, playIcon, reloadDiv, toggleSource, value);
}

/**
 * Handles the different status of content and its impact to the control buttons e.g. open/close and play/pause by button or content
 * @param {HTMLElement} playDiv
 * @param {HTMLElement} playIcon
 * @param {HTMLElement} reloadDiv
 * @param {String} toggleSource
 * @param {Boolean} value
 */
function controlContentStatus(playDiv, playIcon, reloadDiv, toggleSource, value) {
  if (toggleSource === "content" && value === true) {
    controlPauseByContent(playDiv, playIcon, reloadDiv);
  } else if ((toggleSource === "play" || (toggleSource === "button" && playIcon.classList.contains("play"))) && value !== true) {
    controlPauseByClick(playDiv, playIcon);
  } else {
    controlPlay(playDiv, playIcon, reloadDiv);
  }
}

/**
 * Helper function for togglePlay() in case of open content, which pauses and deactivates the play button.
 */
function controlPauseByContent(playDiv, playIcon, reloadDiv) {
  playIcon.classList.remove("play");
  playIcon.classList.add("pause");
  playDiv.classList.add("disabled");
  reloadDiv.classList.add("disabled");
  gamePaused = true;
}

function removeDisabledReloadDiv(reloadDiv) {
  try {
    reloadDiv.classList.remove("disabled");
  } catch {
    return;
  }
}

/**
 * Helper function for togglePlay() in case of closed content and paused the game by Play-button
 */
function controlPauseByClick(playDiv, playIcon) {
  playIcon.classList.remove("play");
  playIcon.classList.add("pause");
  playDiv.classList.remove("disabled");
  gamePaused = true;
}

/**
 * Helper function for togglePlay() in case of closing content and unpaused the game by Play-button
 */
function controlPlay(playDiv, playIcon, reloadDiv) {
  playIcon.classList.remove("pause");
  playIcon.classList.add("play");
  playDiv.classList.remove("disabled");
  removeDisabledReloadDiv(reloadDiv);
  if (startScreen) return;
  gamePaused = false;
}

/**
 * An Ambient Sound is a sound that plays during a time that does not stop by itself.
 */
function allAmbientSounds() {
  playAmbient();
  if (audioPlaying["pepe_snore"]) {
    audioManager.controlAudio("pepe_snore", { play: true });
    audioPlaying["pepe_snore"] = false;
  }
  if (audioPlaying["endbossBackground"]) {
    audioManager.controlAudio("endbossBackground", { play: true, loop: false });
  }
}

/**
 *  Loader will be hidden and its called for showPlayButton()
 */
function hideLoader() {
  const loaderContainer = document.getElementById("loader");
  loaderContainer.innerHTML = "";
  keyboardEnabled = true;
  showPlayButton(loaderContainer);
  letsPlay();
}

/**
 * Creates the Play-Button and appends it to the loader container.
 * @param {HTMLElement} loaderContainer
 */
function showPlayButton(loaderContainer) {
  let startGame = document.createElement("div");
  startGame.id = "startGame";
  startGame.className = "startGame";
  startGame.style.display = "block";
  loaderContainer.appendChild(startGame);
  let subText = document.getElementById("subText");
  subText.classList.remove("displayNone");
}

/**
 * Defines the functionality how to start the game by pressing the Enter-key or clicking the Play-Button
 */
function letsPlay() {
  let startGame = document.getElementById("startGame");
  document.addEventListener("keydown", handleEnterToStart, { once: true });
  startGame.addEventListener("click", handleClickToStart, { once: true });
}

/**
 * Starts game prozess in case of pressing the Enter-key and if Content is not open.
 */
function handleEnterToStart(e) {
  if (e.code == "Enter" && !contentOpen) {
    keyboard.ENTER = true;
    playConditions();
  }
}

/**
 * Starts game prozess in case of click the play button to start and if Content is not open.
 */
function handleClickToStart() {
  if (contentOpen) return;
  playConditions();
}

/**
 * Prepares all conditions that are needed to start the game, e.g. activate the canvas, starts the world, initializes the level, activates the audio context, etc.
 * @param {string} origin
 */
async function playConditions() {
  localStorage.removeItem("autostart");
  startScreen = false;
  audioManager.audioContext?.state === "suspended" && audioManager.activateAudioContext();
  prepareStylesForPlayConditions();
  prepareButtonsForPlayConditions();
  await worldCanvas();
  togglePlay("play", true);
  listenForKeyPress();
  document.addEventListener("keyup", handleKeyUp);
}

/**
 * Listens for key presses and updates the character's last key press time.
 */
function listenForKeyPress() {
  document.addEventListener("keydown", (e) => {
    world.character.setLastKeyPressTime(e);
    handleKeyDown(e);
  });
}

/**
 * Show the Play-Buttons for mobile Devices
 */
function prepareButtonsForPlayConditions() {
  document.getElementById("playButtonsLeft").style.display = "flex";
  document.getElementById("playButtonsRight").style.display = "flex";
}

/**
 * Start the initialization of the game world and Level.
 */
async function worldCanvas() {
  canvas = document.getElementById("canvas");
  canvas.focus();
  world = new World(canvas, Level01);
  world.highscoreManager = new HighscoreManager(world);
  savedHighscore = world.highscoreManager.savedHighscore;
}

/**
 * Help function for playCondition() to prepare the styles.
 */
function prepareStylesForPlayConditions() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("subText").classList.add("displayNone");
  document.getElementById("stayHeadline").classList.add("headline");
  document.getElementById("play").style.display = "";

  let reload = document.getElementById("gohome");
  reload.removeEventListener("click", initReStart);
  reload.style.display = "";
  reload.addEventListener("click", initReStart);
}
