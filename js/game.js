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
let gamePaused = true;
let activeIndex = 0;
let startScreen;
let imgCache = {};
let letters = Array.from(document.querySelectorAll("#loader span"));

let IMAGES_FASTLOAD = [
  "./img/fondo_cactus.png",
  "./img/Desierto-portada_con_pepe.jpg",
  "./img/paper-bg.png",
  "./img/5_background/layers/air.png",
  "./img/skelett_gallina.png",
  "./img/lightning.png",
  "./img/2_character_pepe/1_idle/idle/I-1.png"
];

let imagePaths = [
  ...movingBackground.IMAGES_MOVING,
  ...ThrowableObject.IMAGES_BOTTLE_ONGROUND,
  ...Chicken.IMAGES_WALKING,
  ...MiniChicken.IMAGES_WALKING,
  ...Pepe.IMAGES_WALKING,
  ...Pepe.IMAGES_JUMPING,
  ...Pepe.IMAGES_DYING,
  ...Pepe.IMAGES_HURT,
  ...Pepe.IMAGES_SLEEPING,
  ...StatusBarPepe.IMAGES_SALUD_PEPE,
  ...StatusBarCoin.IMAGES_COIN,
  ...StatusBarChilli.IMAGES_CHILLI,
  ...Clouds.IMAGES_MOVING,
  ...ThrowableObject.IMAGES_BOTTLE_ROTATE,
  ...ThrowableObject.IMAGES_BOTTLE_SPLASH,
  ...MiniChicken.IMAGES_HIT,

  ...StatusBarEndboss.IMAGES_SALUD_ENDBOSS,
  ...Endboss.IMAGES_ALERT,
  ...Endboss.IMAGES_WALK,
  ...Endboss.IMAGES_ATTACK,
  ...Endboss.IMAGES_HURT,
  ...Endboss.IMAGES_DEAD,
];

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
  showStartScreen();
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
  restoreSoundStatus();
  startScreen = true;
  allAmbientSounds();
  hideLoaderAndShowPlayButton();

}

/**
 * 
 * @returns {Promise} A promise that resolves when all fast-loading images are preloaded.
 */
async function fastPreload() {
  return Promise.all(
    IMAGES_FASTLOAD.map((entry) =>
      new Promise((resolve, reject) => {
        const path = typeof entry === "string" ? entry : entry.src;

        const IMG = new Image();
        IMG.onload = () => {
          imgCache[path] = IMG;         // Cache speichern
          resolve({ path, IMG });       // Promise auflösen
        };
        IMG.onerror = reject;
        IMG.src = path;
      })
    )
  );
}


/**
 * Preloads all audio files used in the game.
 */
async function preloadAudio() {
  await Promise.all([
    audioManager.loadAudio("pepe_ambient", "./audio/pepe_ambient.mp3"),

    audioManager.loadAudio("pepe_hurt", "./audio/pepe_grunts_2.mp3"),
    audioManager.loadAudio("pepe_pollo", "./audio/pepe_pollo_funny.mp3"),
    audioManager.loadAudio("pepe_snore", "./audio/pepe_snore.mp3"),

    audioManager.loadAudio("chicken_run", "./audio/chicken_group.mp3"),
    audioManager.loadAudio("chicken_splat", "./audio/chicken_splat.mp3"),

    audioManager.loadAudio("mini_run_0", "./audio/mini_chicken_run.mp3"),
    audioManager.loadAudio("mini_run_1", "./audio/mini_chicken_run.mp3"),
    audioManager.loadAudio("mini_run_2", "./audio/mini_chicken_run.mp3"),
    audioManager.loadAudio("mini_run_3", "./audio/mini_chicken_run.mp3"),
    audioManager.loadAudio("mini_run_4", "./audio/mini_chicken_run.mp3"),
    audioManager.loadAudio("mini_bounce", "./audio/mini_chicken_squeeze_1.mp3"),

    audioManager.loadAudio("endbossBackground", "./audio/endboss_thunder.mp3"),
    audioManager.loadAudio("endboss_attack", "./audio/endboss_attack.mp3"),

    audioManager.loadAudio("bottleCollecting", "./audio/bottle_collect.mp3"),
    audioManager.loadAudio(
      "WorldBottleCollecting",
      "./audio/bottle_collect.mp3"
    ),
    audioManager.loadAudio("coinCollecting", "./audio/coin_success.mp3"),
    audioManager.loadAudio("WorldCoinCollecting", "./audio/coin_success.mp3"),

    audioManager.loadAudio("pepe_wins", "./audio/winning_whoppi.mp3"),
    audioManager.loadAudio("pepe_loses", "./audio/failed_drum.mp3"),
  ]);
}

/**
 * 
 * @returns #{Promise} A promise that resolves when all images are preloaded.
 */
async function preloadImages() {
  return Promise.all(
    imagePaths.map((entry) => {
      let path = typeof entry === "string" ? entry : entry.src;
      return new Promise((resolve, reject) => {
        let IMG = new Image();
        IMG.src = path;
        IMG.onload = () => {
          imgCache[path] = IMG;
          resolve();
        };
        IMG.onerror = () => {
          console.error(`Fehler beim Laden des Bildes: ${path}`);
          reject(new Error(`Bild konnte nicht geladen werden: ${path}`));
        };}); }));
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

  let duration =
    audioManager.buffers && audioManager.buffers["pepe_ambient"]
      ? audioManager.buffers["pepe_ambient"].duration * 1000
      : 10000;

  setTimeout(() => {
    setTimeout(playAmbient, 10000);
  }, duration);
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

  if (toggleSource === "content" && value === true) {
    playIcon.classList.remove("play");
    playIcon.classList.add("pause");
    playDiv.classList.add("disabled");
    gamePaused = true;
  } else if (playIcon.classList.contains("play") && value !== true) {
    playIcon.classList.remove("play");
    playIcon.classList.add("pause");
    playDiv.classList.remove("disabled");
    gamePaused = true;
  } else {
    playIcon.classList.remove("pause");
    playIcon.classList.add("play");
    playDiv.classList.remove("disabled");
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
 * Gives the Loading Visual a nice effect by animating the letters of the text "LOADING ...".
 */
function LoadingVisual() {
  const loaderText = "LOADING ...";
  const loaderContainer = document.getElementById("loader");

  loaderContainer.innerHTML = "";
  const chars = loaderText.split("");

  chars.forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${index * 0.2}s`;
    loaderContainer.appendChild(span);

    setTimeout(() => {
      span.style.opacity = 1;
    }, index * 1000);
  });
}

/**
 * Defines the functionality how to start the game by pressing the Enter-key or clicking the Play-Button
 */
function letsPlay() {
  let startGame = document.getElementById("startGame");
  document.addEventListener("keydown", (e) => {
    if (e.code == "Enter") {
      keyboard.ENTER = true;
      playConditions("initial");
    }
  });

  startGame.addEventListener("click", () => {
    playConditions("initial");
  });
}

/**
 * 
 * @param {*} origin Prepares all conditions that are needed to start the game, e.g. activate the canvas, starts the world, initializes the level, activates the audio context, etc.
 */
async function playConditions(origin) {
  if (origin !== "initial") {
    document.getElementById("gameOverScreen").classList.add("displayNone");
  }
  prepareStylesForPlayConditions();

  // await initLevel();
  canvas = document.getElementById("canvas");
  canvas.focus();

  if (!Level01) {
    console.error("Fehler: Level01 ist nicht initialisiert!");
  } else {
    window.world = new World(canvas, Level01);
    togglePlay("play", true);

    if (!audioManager.audioContext) {
      activateAudioContext();
    }
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
}

/**
 * Defines the Button on the keyboard that are used to control the game.
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
