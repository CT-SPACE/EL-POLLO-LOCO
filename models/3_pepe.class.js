class Pepe extends MovableObject {
    x = 0;
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

    constructor(keyboard){

       super().loadImage('../img/2_character_pepe/2_walk/W-21.png');
       this.keyboard = keyboard;
       this.loadImages(this.IMAGES_WALKING);
        this.animateWalk();

    }

    animateWalk(){

        setInterval(() => {
            if (keyboard.RIGHT){
                this.x += this.speed; 
                this.otherDirection = false;
                
            }
            if(keyboard.LEFT && this.x > 10 && this.x < this.world.level.level_endX){
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

   

    jump() {
        console.log("move right");
    }   
  
}