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
let letters = Array.from(document.querySelectorAll("#loader span"));
// let IMAGES_SINGLES = [
//   "./img/5_background/layers/air.png",
//   "./img/5_background/Desierto-portada_con_pepe.jpg",
//   "./img/paper-bg.png",
// ];

let IMAGES_FASTLOAD = [
  "../img/fondo_cactus.png",
  "../img/Desierto-portada_con_pepe.jpg",
  "../img/paper-bg.png",
  "../img/5_background/layers/air.png",
  "../img/skelett_gallina.png",
  "../img/lightning.png"
];

let imagePaths = [
  ...movingBackground.IMAGES_MOVING,
  ...ThrowableObject.IMAGES_BOTTLE_ROTATE,
  ...ThrowableObject.IMAGES_BOTTLE_SPLASH,
  ...ThrowableObject.IMAGES_BOTTLE_ONGROUND,
  ...StatusBarPepe.IMAGES_SALUD_PEPE,
  ...StatusBarEndboss.IMAGES_SALUD_ENDBOSS,
  ...StatusBarCoin.IMAGES_COIN,
  ...StatusBarChilli.IMAGES_CHILLI,
  ...Pepe.IMAGES_WALKING,
  ...Pepe.IMAGES_JUMPING,
  ...Pepe.IMAGES_DYING,
  ...Pepe.IMAGES_HURT,
  ...Pepe.IMAGES_SLEEPING,
  ...Endboss.IMAGES_ALERT,
  ...Endboss.IMAGES_WALK,
  ...Endboss.IMAGES_ATTACK,
  ...Endboss.IMAGES_HURT,
  ...Endboss.IMAGES_DEAD,
  ...Clouds.IMAGES_MOVING,
  ...Chicken.IMAGES_WALKING,
  ...MiniChicken.IMAGES_WALKING,
  ...MiniChicken.IMAGES_HIT
];

document.addEventListener("DOMContentLoaded", async () => {
    await init();
});


// async function init() {
//     await fastPreload();
//     try {
//         LoadingVisual();
//     } catch (error) {
//         console.error("Fehler in LoadingVisual:", error);
//         return;
//     }

//     restoreSoundStatus();
//     startScreen = true;



//     await preloadAudio();
//     try {
//         await preloadImages();
//     } catch (error) {
//         console.error("Fehler beim Laden der Bilder:", error);
//     }

//     allAmbientSounds();
// }

// window.addEventListener("unhandledrejection", event => {
//   console.error("Uncaught Promise Fehler:", event.reason);
// });

async function init() {
    // Starte den Ladevorgang
    await loadGameAssets();

    // Zeige den Startbildschirm an
    showStartScreen();
}

async function loadGameAssets() {
    // Lade alle Assets (Bilder, Sounds)
    await fastPreload();
    LoadingVisual();
    await preloadAudio();
    await preloadImages();
}

function showStartScreen() {
    // Zeige den Startbildschirm an
    restoreSoundStatus();
    startScreen = true;
    allAmbientSounds();
    hideLoaderAndShowPlayButton();
}


async function fastPreload() {
  return Promise.all(
    IMAGES_FASTLOAD.map(
      (path) =>
        new Promise((resolve, reject) => {
          let IMG = new Image();
          IMG.src = path;
          IMG.onload = () => resolve({ path, IMG });
          IMG.onerror = reject;
        })
    )
  );
}


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
    audioManager.loadAudio("WorldBottleCollecting", "./audio/bottle_collect.mp3"),
    audioManager.loadAudio("coinCollecting", "./audio/coin_success.mp3"),
    audioManager.loadAudio("WorldCoinCollecting", "./audio/coin_success.mp3"),

    audioManager.loadAudio("pepe_wins", "./audio/winning_whoppi.mp3"),
    audioManager.loadAudio("pepe_loses", "./audio/failed_drum.mp3"),
  ]);
}

async function preloadImages() {
  await fastPreload();
  return Promise.all(
    imagePaths.map(
      (path) =>
        new Promise((resolve, reject) => {
          let IMG = new Image();
          IMG.src = path;
          let loadedCount = 0;
          IMG.onload = () => {
            loadedCount++;
            // console.log(
            //   `Bild geladen: ${path} (${loadedCount}/${imagePaths.length})`
            // );
            resolve({ path, IMG });
          };

          IMG.onerror = () => {
            console.error(`Fehler beim Laden des Bildes: ${path}`);
            reject();
          };
        })
    )
  );
}

function pauseGameSounds() {
  audioManager.setMuted(true);
  allAmbientSounds();
}

function resumeGameSounds() {
  audioManager.setMuted(false);
}

function playAmbient() {
  audioManager.loadAudio("pepe_ambient", "./audio/pepe_ambient.mp3");
  audioManager.playAudio("pepe_ambient", { play: true, volume: 0.1 });

  let duration =
    audioManager.buffers && audioManager.buffers["pepe_ambient"]
      ? audioManager.buffers["pepe_ambient"].duration * 1000
      : 10000; // Fallback: 10 Sekunden

  setTimeout(() => {
    setTimeout(playAmbient, 5000); // 5 Sekunden Pause nach dem Ende
  }, duration);
}

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

function toggleSound() {
  let isOn = !getSoundStatus();
  setSoundStatus(isOn);
  applySoundStatus(isOn);
}

function restoreSoundStatus() {
  let isOn = getSoundStatus();
  applySoundStatus(isOn);
}

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

function setSoundStatus(isOn) {
  localStorage.setItem("soundOn", isOn ? "true" : "false");
}

function getSoundStatus() {
  const value = localStorage.getItem("soundOn");
  if (value === null) return true;
  return value === "true";
}

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

function LoadingVisual() {
  const loaderText = "LOADING ...";
  const loaderContainer = document.getElementById("loader");

  loaderContainer.innerHTML = "";
  const chars = loaderText.split("");

  chars.forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${index * 0.2}s`; // Verzögerung für jedes Zeichen
    loaderContainer.appendChild(span);

    setTimeout(() => {
      span.style.opacity = 1;
    }, index * 1000);
  });
}

function letsPlay() {
  let startGame = document.getElementById("startGame");
   document.addEventListener("keydown", (e) => {
  // console.log(e);
  if (e.code == "Enter") {
    keyboard.ENTER = true;
    playConditions();
  }
});

  startGame.addEventListener("click", () => {
playConditions()
  });

}


async function playConditions(){
  document.getElementById("startScreen").style.display = "none";
      subText.classList.add("displayNone");
  document.getElementById("stayHeadline").classList.add("headline");
  initLevel();
      canvas = document.getElementById("canvas");
    canvas.focus();

    if (!Level01) {
    console.error("Fehler: Level01 ist nicht initialisiert!");
    } else {
      // console.log("Erstelle neue Welt...");
    window.world = new World(canvas, Level01);
    }
    togglePlay("play", true);
    // audio.activateAudioContext();

     if (!audioManager.audioContext) {
       activateAudioContext();
        // console.log("AudioContext gestartet:", audioManager.audioContext.state);
    }
}

function restartGame() {
      gamePaused = false;
    keyboardEnabled = true;
    EndBossClose = false;
    // world = null;
    level = null;
    // keyboard = new Keyboard();
    canvas = document.getElementById("canvas");
canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
document.removeEventListener("keydown", letsPlay);
let startGame = document.getElementById("startGame");
startGame.removeEventListener("click", letsPlay);

    if (window.world) {
    window.world = null; 
}

    // Reset audio
    audioManager.setMuted(false);
    audioManager.activateAudioContext();
    
    // Reset UI
    document.getElementById('gameOverScreen').classList.add('displayNone');
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("subText").classList.add("displayNone");
    document.getElementById("stayHeadline").classList.add("headline");
    
     letsPlay();
    
    // Create new world
    window.world = new World(canvas, Level01);
    
    // Start new game
    togglePlay("play", true);
}



document.addEventListener("keydown", (e) => {


 if (gamePaused) return;
  if (!keyboardEnabled) return; // Ignorieren, wenn die Steuerung deaktiviert ist

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
    // console.log("KeyD pressed");
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
      keyboard.THROW = true; // Löst den Wurf aus
    }
  }
});

