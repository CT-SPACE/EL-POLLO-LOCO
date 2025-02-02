
let canvas;
let world;
let keyboard = new Keyboard();


function preload(){
    character.src = '../img/2_character_pepe/2_walk/W-21.png';
}   

function init(){

    canvas = document.getElementById('canvas');
       world = new World(canvas);
    }

   document.addEventListener('keydown', (e) => {
    if(e.code == 'Space'){
        keyboard.SPACE = true;
    }
    if(e.code == 'ArrowRight'){    
        keyboard.RIGHT = true;
    }
    if(e.code == 'ArrowLeft'){
        keyboard.LEFT = true;
    }
    if(e.code == 'ArrowUp'){
        keyboard.UP = true;
    }
    if(e.code == 'ArrowDown'){
        keyboard.DOWN = true;
    }
    if(e.code === 'KeyS'){
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
        if(e.code == 'KeyS'){
            keyboard.THROW = false;
        }

        });
    
