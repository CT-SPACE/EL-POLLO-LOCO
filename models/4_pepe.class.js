class Pepe extends MovableObject {
  static IMAGES_WALKING = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];
  static IMAGES_JUMPING = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];
  static IMAGES_DYING = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];
  static IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
  ];
  static IMAGES_SLEEPING = [
    "./img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];


  isPlayingHurtAudio = false;

  x = 0;
  y = 40;
  height = 340;
  width = 160;
  world;
  audioManager;
  lastKeyPressTime = Date.now();
  isSleepingState = false;
  isDead = false;
  deathHandled = false; // Flag to check if death animation has been handled
  animateWalkInterval;
  animateDeathInterval;
  timeToSleep = 60000;
  keyboard;
  cameraX;
  speed = 20;
  speedY = 0;
  frameIndex = 0;
  offset = {
    left: 30,
    right: 40,
    top: 130,
    bottom: 20,
  };

  constructor(keyboard) {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");

    this.keyboard = keyboard;
    this.loadImages(Pepe.IMAGES_WALKING);
    this.loadImages(Pepe.IMAGES_JUMPING);
    this.loadImages(Pepe.IMAGES_DYING);
    this.loadImages(Pepe.IMAGES_HURT);
    this.loadImages(Pepe.IMAGES_SLEEPING);
    this.audio = audioManager;
    
    this.animateWalk();
    this.applyGravity();
    this.listenForKeyPress(this.lastKeyPressTime);
    this.isPlayingHurtAudio = false;
    this.animateStates();
  }
  

  animateWalk() {
    this.x = 100;

     this.animateWalkInterval = setInterval(() => {
         if (this.energy <= 0) return;

        if (keyboard.RIGHT && this.x < this.world.level.level_endX) {
          this.handleRightMovement();
      }
        if (keyboard.LEFT && this.x > 100) {
          this.handleLeftMovement();
        }
        if ((keyboard.UP || keyboard.SPACE) && this.y >= 100) {
          this.jump();
        }

        this.world.cameraX = -this.x + 100;
      
    }, 3000 / 25);
}

  listenForKeyPress(lastKeyPressTime) {
    this.lastKeyPressTime = lastKeyPressTime;
    document.addEventListener("keydown", () => {
      this.lastKeyPressTime = Date.now();
      // console.log("Key pressed at:", this.lastKeyPressTime);
      if (this.isSleepingState) {
        this.stopSleepAnimation();
      }
    });
  }

  handleRightMovement(){
             this.stopSleepAnimation();
          this.playAnimation(Pepe.IMAGES_WALKING);
          // this.otherDirection = false;
          this.moveRight();
          if (!this.audio.audioPlaying["pepe_pollo"]) {
             this.audio.playAudio("pepe_pollo", { loop: false, volume: 0.4 });
           
        }
  }

  handleLeftMovement(){
          this.stopSleepAnimation();
          this.playAnimation(Pepe.IMAGES_WALKING);
          this.moveLeft(this.speed);
          this.otherDirection = true;
  }

  stopSleepAnimation() {
    this.isSleepingState = false;

    this.audio.controlAudio("pepe_snore", {
      play: false,
      pause: true,
      currentTime: 0,
    });

  }

  animateStates() {
    this.isPlayingHurtAudio = false;

    setInterval(() => {
      if (this.isZeroHealthscore()) {
        this.animateDeath();
      } else if (this.isHurt()) {
        this.animateHurt();
      } else if (this.isAboveGround()) {
        this.playAnimation(Pepe.IMAGES_JUMPING);

      } else if (Date.now() - this.lastKeyPressTime >= this.timeToSleep) {
        this.isSleepingState = true;
        this.animateSleep();
      } else {
        this.stopSleepAnimation();
      }
    }, 500);
  }

  animateSleep() {
    this.isSleepingState = true;

    this.playAnimation(Pepe.IMAGES_SLEEPING);
    if (!this.audio.audioPlaying["pepe_snore"]) {
      this.audio.playAudio("pepe_snore", { loop: true, volume: 0.4 });
      this.audio.audioPlaying["pepe_snore"] = true;
    }
    this.audio.controlAudio("pepe_pollo", { play:false, pause: true, currentTime: 0 });

  }

  animateDeath() {
    this.isDead = true;
    this.deathHandled = false; 
    this.playAnimation(Pepe.IMAGES_DYING);
    this.audio.controlAudio("pepe_snore", { pause: true, currentTime: 0 });

  }


// animateDeath() {
//     if (!this.isDead) {
//         this.isDead = true;
//         this.animateDeathInterval = setInterval(() => {
//             if (this.IMAGES_DYING.length - 1) {
//                 clearInterval(this.animateDeathInterval);
//                 this.animateDeathInterval = null; // Wichtig für die Prüfung!
//             } else {
//                 this.playAnimation(this.IMAGES_DYING);
//             }
//         }, 100);
//         this.audio.controlAudio("pepe_snore", { pause: true, currentTime: 0 });
//     }
// }

  animateJump() {
    this.playAnimation(Pepe.IMAGES_JUMPING);
  }

  animateHurt() {
    this.playAnimation(Pepe.IMAGES_HURT);

    if (!this.isPlayingHurtAudio) {
      this.audio.playAudio("pepe_hurt", { play: true, volume: 0.5, loop: false });

    }
  }
}
