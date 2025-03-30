class Pepe extends MovableObject {
 
    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        './img/2_character_pepe/3_jump/J-31.png',
        './img/2_character_pepe/3_jump/J-32.png',
        './img/2_character_pepe/3_jump/J-33.png',
        './img/2_character_pepe/3_jump/J-34.png',
        './img/2_character_pepe/3_jump/J-35.png',
        './img/2_character_pepe/3_jump/J-36.png',
        './img/2_character_pepe/3_jump/J-37.png',
        './img/2_character_pepe/3_jump/J-38.png',
          './img/2_character_pepe/3_jump/J-39.png'

    ];
    IMAGES_DYING = [
        './img/2_character_pepe/5_dead/D-51.png',
        './img/2_character_pepe/5_dead/D-52.png',
        './img/2_character_pepe/5_dead/D-53.png',
        './img/2_character_pepe/5_dead/D-54.png',
        './img/2_character_pepe/5_dead/D-55.png',
        './img/2_character_pepe/5_dead/D-56.png',
      './img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        './img/2_character_pepe/4_hurt/H-41.png',
        './img/2_character_pepe/4_hurt/H-42.png',
        './img/2_character_pepe/4_hurt/H-43.png'
    ];
    pepe_pollo = new Audio('./audio/pepe_pollo_funny.mp3');
    chicken_splat = new Audio('./audio/chicken_splat.mp3');
    pepe_caramba = new Audio('./audio/pepe_caramba_funny.mp3');
    pepe_hurt = new Audio('./audio/pepe_grunts.mp3');

    x = 0;
    y = 40;
    height = 340;
    width = 160;
    world;

    keyboard;
    cameraX;
    speed = 20;
    speedY = 0;
    frameIndex = 0;

    offset = {
        left: 30,
        right: 40,
        top: 130,
        bottom: 40
    }
    

    constructor(keyboard){

       super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
       this.keyboard = keyboard;
       this.loadImages(this.IMAGES_WALKING);
       this.loadImages(this.IMAGES_JUMPING);
       this.loadImages(this.IMAGES_DYING);
       this.loadImages(this.IMAGES_HURT);
        this.animateWalk();
        this.applyGravity();

    }

    animateWalk(){
        this.x = 100; 
         this.pepe_pollo.pause();
        setInterval(() => {
          
            //this.walking_sound.pause();
            // if(this.energy > 0){
    if (keyboard.RIGHT && (this.x < this.world.level.level_endX)){
                this.moveRight();
        
                this.pepe_pollo.play();
                this.pepe_pollo.volume = 0.4;
                this.pepe_pollo.loop = false;
              
                this.otherDirection = false;
            }
        
    if(keyboard.LEFT && this.x > 100){
                      this.moveLeft();
                      this.otherDirection = true;
                    //this.walking_sound.play();
            }
     if((keyboard.UP || keyboard.SPACE) && this.y >= 100 && (this.x < (this.world.level.level_endX + 20))){
                this.jump();

                }
                  

            this.world.cameraX = -this.x + 100;
        
        }, 3000 / 60);
    

          setInterval(() => {  
        
            if(this.isDead(this)){
                this.animateDeath();

            } else if (this.isHurt()){
                this.playAnimation(this.IMAGES_HURT);
                this.pepe_hurt.play();
                 this.pepe_pollo.pause();
                
            }
            else if(this.isAboveGround()){
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if(keyboard.RIGHT || keyboard.LEFT){
              this.playAnimation(this.IMAGES_WALKING)  
                ;
            }
        
            }
        }, 10000 / 60);
}


    animateDeath(){
                this.playAnimation(this.IMAGES_DYING);
    }
    animateHurt(){
        setInterval(() => {
                this.playAnimation(this.IMAGES_HURT);
                    }, 1000 / 60);
    }
  
}