/**
 * Declaration of global variables and constants
 * This file is responsible for initializing the game, loading assets, and managing the game state.
 */

let canvas;
let world;
let Level01;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let audioPlaying = {};
let pepe_ambient;
let chicken_run;
let keyboardEnabled = true;
let EndBossClose = false;
let throwKeyDownTime;
let throwKeyUpTime;
let throwDuration;
let contentOpen;
let gamePaused = true;
let gamePausedByUser = false;
let activeIndex = 0;
let startScreen;
let imgCache = {};
let letters = Array.from(document.querySelectorAll("#loader span"));
let aspectRatio = 800 / 480;
let newWidth, newHeight;
let touchSetupDone = false;




/**
 * Prepares the "turn your Device"-Screen
 * @returns {boolean} 
 */
  function isPortrait() {
    return window.innerHeight > window.innerWidth && window.innerWidth <= 960;
  }

/**
 * Eventlistener for device format detection
 */

window.addEventListener('DOMContentLoaded', function() {
window.addEventListener('resize', function() {
      let turnDevice = document.getElementById("turnToLandscape");
      let contentbox = document.getElementById("contentbox");
      if (isPortrait()) {
        turnDevice.classList.remove("displayNone");
        contentbox.style.display = "none";
    } else {
        turnDevice.classList.add("displayNone");
        contentbox.style.display = '';
    }
  }
)})

/**
 * Starts the Init-Function after the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await init();
});

/**
 * Initialises the game by loading assets and showing the start screen.
 */
async function init() {
  await loadGameAssets();
  restoreSoundStatus();
  document.getElementById("sound").style.display = "";
 if (localStorage.getItem("autostart") === "true") {

  playConditions();
}else {

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
  hideLoaderAndShowPlayButton();

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
 * Starts the Ambient Sound of the Game
 */
function playAmbient() {
  audioManager.loadAudio("pepe_ambient", "./audio/pepe_ambient.mp3");
  audioManager.playAudio("pepe_ambient", { play: true, volume: 0.1 });

  let duration = audioDuration();


  setTimeout(() => {
    setTimeout(playAmbient, 10000);
  }, duration);
}

/**
 * Helper function to get the duration of the ambient sound.
 */
function audioDuration() {
      return audioManager.buffers && audioManager.buffers["pepe_ambient"]
      ? audioManager.buffers["pepe_ambient"].duration * 1000
      : 10000;
}

/**
 * Reacts to the sound status stored in the localstorage and applies it to the corresponding buttons.
 */
function applySoundStatus(isOn) {
  let soundIcon = document.getElementById("on-off");
  if (isOn) {
    soundIcon.classList.remove("soundOFF");
    soundIcon.classList.add("soundON");
    audioManager.setMuted(false);
    allAmbientSounds();
  } else {
    soundIcon.classList.remove("soundON");
    soundIcon.classList.add("soundOFF");
    audioManager.setMuted(true);
  }
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
 * 
 * @param {*} toggleSource Defines the source of the toggle action, e.g., "content" or "play".
 * @param {*} value The value adds a condition to the toggle source to distinguish between play source with the value true or false
 */
function togglePlay(toggleSource, value) {
  let playDiv = document.getElementById("play");
  let playIcon = document.getElementById("switch");
  if (toggleSource === "content" && value === true) { // Pause-Icon and Disabled
    playIcon.classList.remove("play");
    playIcon.classList.add("pause");
    playDiv.classList.add("disabled");
    gamePaused = true;
  } else if ((toggleSource === "play" || (toggleSource === "button" && playIcon.classList.contains("play"))) && value !== true ) {//Pause-Icon not Disabled
    playIcon.classList.remove("play");
    playIcon.classList.add("pause");
    playDiv.classList.remove("disabled");
    gamePaused = true;
  } 
  else { // Play-Icon not Disabled
    playIcon.classList.remove("pause");
    playIcon.classList.add("play");
    playDiv.classList.remove("disabled");
      if(startScreen) return;
    gamePaused = false;
  }
}

/**
 * 
 * @param {*} isOn Saves the sound status in the local storage.
 */
function setSoundStatus(isOn) {
  localStorage.setItem("soundOn", isOn ? "true" : "false");
}

/**
 * 
 * @returns {boolean} Returns the sound status from local storage. If no value is set, it defaults to true.
 */
function getSoundStatus() {
  const value = localStorage.getItem("soundOn");
  if (value === null) return true;
  return value === "true";
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
 * When the Start Game Button is shown, the Loader will be hidden
 */
function hideLoaderAndShowPlayButton() {
  const loaderContainer = document.getElementById("loader");
  loaderContainer.innerHTML = "";
  keyboardEnabled = true;
  let startGame = document.createElement("div");
  startGame.id = "startGame";
  startGame.className = "startGame";
  startGame.style.display = "block";
  loaderContainer.appendChild(startGame);
  let subText = document.getElementById("subText");
  subText.classList.remove("displayNone");

  letsPlay();
}

/**
 * Defines the functionality how to start the game by pressing the Enter-key or clicking the Play-Button
 */
function letsPlay() {
  let startGame = document.getElementById("startGame");
  
  document.addEventListener("keydown", (e) => {
  
    if (e.code == "Enter") {
      if(contentOpen) return;
      keyboard.ENTER = true;
      playConditions();
    }
  });
  startGame.addEventListener("click", () => {
    if(contentOpen) return;
    playConditions();
  });
}

/**
 * Prepares all conditions that are needed to start the game, e.g. activate the canvas, starts the world, initializes the level, activates the audio context, etc.
 * @param {string} origin 
 */
async function playConditions() {
  localStorage.removeItem("autostart");
  startScreen = false;
  prepareStylesForPlayConditions();

  document.getElementById("playButtonsLeft").style.display = "unset";
  document.getElementById("playButtonsRight").style.display = "unset";
  
  canvas = document.getElementById("canvas");
  canvas.focus();

    window.world = new World(canvas, Level01);
    togglePlay("play", true);

if (audioManager.audioContext && audioManager.audioContext.state === "suspended") {
  audioManager.activateAudioContext();
}
}

/**
 * Help function for playCondition() to prepare the styles.
 */
function prepareStylesForPlayConditions() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("subText").classList.add("displayNone");
  document.getElementById("stayHeadline").classList.add("headline");
  document.getElementById("play").style.display = "";
  
  let reload = document.getElementById("restart")
  reload.style.display = "";
  reload.addEventListener("click", () => {
  location.reload();
});
}


/**
 * Restarts the game directly and ready to play.
 * This function is called when the user clicks the "Restart" button. 
 */
function reStart() {

  localStorage.setItem("autostart", true);
location.reload();
}



