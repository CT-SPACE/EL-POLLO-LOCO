
let canvas;
let world;
let keyboard = new Keyboard();
let pepe_ambient;
let chicken_run;
let keyboardEnabled = true;

// function preload(){
//     pepe_ambient = new Audio('./audio/pepe_ambient.mp3');
//     pepe_ambient.loop = false;
//       setInterval(() => {
//     pepe_ambient.loop = true; 
// }, 5000);
// }   

// function init(){

//     canvas = document.getElementById('canvas');
//        world = new World(canvas);
//        preload();
//        pepe_ambient.play();
//        pepe_ambient.volume = 0.6;
       
//     }

function preload() {
    pepe_ambient = new Audio('./audio/pepe_ambient.mp3');
    chicken_run = new Audio('./audio/chicken_group.mp3');
}

function playWithPause() {
    pepe_ambient.play(); // Audio abspielen
    pepe_ambient.volume = 0.1;
    chicken_run.pause();
// WIEDER EINSCHALTEN WENN TESTPHASE VORBEI
    // pepe_ambient.addEventListener('ended', () => {
    //     setTimeout(() => {
    //         pepe_ambient.play();
    //     }, 5000);
    // });
}

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);
    preload();
    playWithPause();
}


//    document.addEventListener('keydown', (e) => {
//     if(e.code == 'Space'){
//         keyboard.SPACE = true;
//     }
//     if(e.code == 'ArrowRight'){    
//         keyboard.RIGHT = true;
//     }
//     if(e.code == 'ArrowLeft'){
//         keyboard.LEFT = true;
//     }
//     if(e.code == 'ArrowUp'){
//         keyboard.UP = true;
//     }
//     if(e.code == 'ArrowDown'){
//         keyboard.DOWN = true;
//     }
//     if(e.code == 'KeyD'){
//         keyboard.THROW = true;
//     }

//     });


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
    }
});

    document.addEventListener('keyup', (e) => {
        if(e.code == 'Space'){
            keyboard.SPACE = false;
        }
        if(e.code == 'ArrowRight'){    
            keyboard.RIGHT = false;
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
    
