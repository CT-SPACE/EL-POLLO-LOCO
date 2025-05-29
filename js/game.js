
let canvas;
let world;
let keyboard = new Keyboard();
let audio = new AudioManager();
let audioPlaying = {};
let pepe_ambient;
let chicken_run;
let keyboardEnabled = true;
let throwKeyDownTime;
let throwKeyUpTime;
let throwDuration;
let gamePaused = false;


async function init() {
    restoreSoundStatus();
    initLevel();
    canvas = document.getElementById('canvas');

    window.world = new World(canvas);
    await preloadAudio();
    allAmbientSounds();
}


async function preloadAudio() {
    await Promise.all([
    audio.loadAudio('pepe_ambient', './audio/pepe_ambient.mp3'),

    audio.loadAudio('pepe_hurt', './audio/pepe_grunts_2.mp3'),
    audio.loadAudio('pepe_pollo', './audio/pepe_pollo_funny.mp3'),
    audio.loadAudio('pepe_snore', './audio/pepe_snore.mp3'),

    audio.loadAudio('chicken_run', './audio/chicken_group.mp3'),
    audio.loadAudio('chicken_splat', './audio/chicken_splat.mp3'),

    audio.loadAudio('endbossBackground', './audio/endboss_thunder.mp3'),
    audio.loadAudio('endboss_attack', './audio/endboss_attack.mp3'),

    audio.loadAudio('bottleCollecting', './audio/bottle_collect.mp3'),
    audio.loadAudio('WorldBottleCollecting', './audio/bottle_collect.mp3'), 
    audio.loadAudio('coinCollecting', './audio/coin_success.mp3'),
    audio.loadAudio('WorldCoinCollecting', './audio/coin_success.mp3'),
    ])
}

async function preloadSounds(soundPaths) {
    return Promise.all(
        soundPaths.map(
            path =>
                new Promise((resolve, reject) => {
                    const audio = new Audio();
                    audio.src = path;
                    audio.oncanplaythrough = () => resolve({ path, audio });
                    audio.onerror = reject;
                })
        )
    );
}

async function preloadImages(imagePaths) {
    return Promise.all(
        imagePaths.map(
            path =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = path;
                    img.onload = () => resolve({ path, img });
                    img.onerror = reject;
                })
        )
    );
}

function pauseGameSounds() {
    audio.setMuted(true);
    allAmbientSounds();
}

function resumeGameSounds() {
audio.setMuted(false);
}



function playAmbient() {
   
    audio.loadAudio('pepe_ambient', './audio/pepe_ambient.mp3');
    audio.playAudio('pepe_ambient', { play: true, volume: 0.1 });

    let duration = audio.buffers && audio.buffers['pepe_ambient']
        ? audio.buffers['pepe_ambient'].duration * 1000
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
        audio.setMuted(false);
        allAmbientSounds();
    } else {
        soundIcon.classList.remove("soundON");
        soundIcon.classList.add("soundOFF");
        audio.setMuted(true);
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
    console.log("toggleSource:", toggleSource, "value:", value);

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

function setSoundStatus(isOn){
    localStorage.setItem('soundOn', isOn ? 'true' : 'false');
}

function getSoundStatus() {
    const value = localStorage.getItem('soundOn');
    if (value === null) return true;
    return value === 'true';
}



function allAmbientSounds() {
  
   playAmbient();

    if (audioPlaying["pepe_snore"]) {
        audio.controlAudio("pepe_snore", { play: true });
        audioPlaying["pepe_snore"] = false;
    } 
    if (audioPlaying["endbossBackground" ]) {
        audio.controlAudio("endbossBackground", { play: true, loop: false });
    }
}

document.addEventListener('keydown', (e) => {
    
    if (gamePaused) return;
    if (!keyboardEnabled) return; // Ignorieren, wenn die Steuerung deaktiviert ist

    if (e.code == 'Space') {
        keyboard.SPACE = true;
    }
    if (e.code == 'ArrowRight') {
        keyboard.RIGHT = true;
      
    }
    if (e.code == 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (e.code == 'ArrowUp') {
        keyboard.UP = true;
    }
    if (e.code == 'ArrowDown') {
        keyboard.DOWN = true;
    }
    if (e.code == 'KeyD') {
        
        if (!throwKeyDownTime) {
           throwKeyDownTime = Date.now();
        }
        console.log("KeyD pressed");
    }
    audio.activateAudioContext();
});

document.addEventListener('keyup', (e) => {
        if(e.code == 'Space'){
            keyboard.SPACE = false;
        }
        if(e.code == 'ArrowRight'){    
            keyboard.RIGHT = false;
            audioPlaying["pepe_pollo"] = false;
        }
        if(e.code == 'ArrowLeft'){
            keyboard.LEFT = false;
        }
        if(e.code == 'ArrowUp'){
            keyboard.UP = false;
        }
        if(e.code == 'ArrowDown'){
            keyboard.DOWN = false;
        }
        if(e.code == 'KeyD'){
            if (throwKeyDownTime) {
                throwKeyUpTime = Date.now();
                throwDuration = throwKeyUpTime - throwKeyDownTime;
                throwKeyDownTime = null;
            keyboard.THROW = true; // Löst den Wurf aus
        }

        }

        });

document.addEventListener("keyup", (event) => {
            if (event.code === "ArrowRight") { // Sicherstellen, dass es wirklich die richtige Taste ist
                audioPlaying["pepe_pollo"] = false;
            }
        });
document.addEventListener('click', () => {
            audio.activateAudioContext();
        });
    
       
