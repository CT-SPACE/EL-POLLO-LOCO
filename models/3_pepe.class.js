class Pepe extends MovableObject {
    x = 50;
    y = 100;
    height = 340;
    width = 160;
    IMAGES_WALKING = [
        '../img/2_character_pepe/2_walk/W-21.png',
        '../img/2_character_pepe/2_walk/W-22.png',
        '../img/2_character_pepe/2_walk/W-23.png',
        '../img/2_character_pepe/2_walk/W-24.png',
        '../img/2_character_pepe/2_walk/W-25.png',
        '../img/2_character_pepe/2_walk/W-26.png'
    ];
    world;
    keyboard;
    speed = 20;

    constructor(){
       super().loadImage('../img/2_character_pepe/2_walk/W-21.png');
       this.loadImages(this.IMAGES_WALKING);
        this.animateWalk();

    }

    animateWalk(){

        setInterval(() => {
            if (keyboard.RIGHT){
                this.x += this.speed; 
                this.otherDirection = false;
            }
            if(keyboard.LEFT){
                        this.otherDirection = true;
                this.x -= this.speed;
            }
            this.world.cameraX = -this.x;
        }, 5000 / 60);
        
        setInterval(() => {
            if(keyboard.RIGHT || keyboard.LEFT){
                let i = this.currentIMG % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imgCache[path];  
                this.currentIMG++;     
            }
        }, 5000 / 60);

    }

    moveRight() {
        if(!keyboard.RIGHT){
            this.speed = 0;
        
        setInterval(() => {
            this.x += this.speed;
        }, 3000 / 60);
    }
        console.log("move right");
    
    }

    moveLeft(){
        if(!keyboard.LEFT){
            this.speed = 0;
        
        setInterval(() => {
            this.x -= this.speed;
        }, 3000 / 60);
    }
        console.log("move left");
    }


    jump() {
        console.log("move right");
    }   
  
}