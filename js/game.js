
let canvas;
let world;
let keyboard = new Keyboard();
let audio = new AudioManager();
let audioPlaying = {};
let pepe_ambient;
let chicken_run;
let keyboardEnabled = true;


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


async function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    window.world = new World(canvas);
    await preloadAudio();
    playAmbient();
}


function playAmbient() {
audio.loadAudio('pepe_ambient', './audio/pepe_ambient.mp3');

    setTimeout(() => audio.playAudio('pepe_ambient', { play:true, volume: 0.1 }), 3000);

}

function toggleSound() {
  let soundButton = document.getElementById("sound");
  let soundIcon = document.getElementById("on-off");
  soundButton.classList.toggle("soundButton");
  soundIcon.classList.toggle("soundIcon");
}


document.addEventListener('keydown', (e) => {
    
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
        keyboard.THROW = true;
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
            keyboard.THROW = false;
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
    
       
