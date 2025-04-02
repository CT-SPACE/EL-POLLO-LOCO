class Pepe extends MovableObject {
  IMAGES_WALKING = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
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
  IMAGES_DYING = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_SLEEPING = [
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
  pepe_pollo = new Audio("./audio/pepe_pollo_funny.mp3");
  chicken_splat = new Audio("./audio/chicken_splat.mp3");
  pepe_caramba = new Audio("./audio/pepe_caramba_funny.mp3");
  pepe_snore = new Audio("./audio/pepe_snore.mp3");
  pepe_hurt = new Audio("./audio/pepe_grunts_2.mp3");
  // [
  //   new Audio("./audio/pepe_grunts_10.mp3"),
  //   new Audio("./audio/pepe_grunts_1.mp3"),
  //   new Audio("./audio/pepe_grunts_2.mp3"),
  //   new Audio("./audio/pepe_grunts_3.mp3"),
  //   new Audio("./audio/pepe_grunts_4.mp3"),
  //   new Audio("./audio/pepe_grunts_5.mp3"),
  //   new Audio("./audio/pepe_grunts_6.mp3"),
  //   new Audio("./audio/pepe_grunts_7.mp3"),
  //   new Audio("./audio/pepe_grunts_8.mp3"),
  //   new Audio("./audio/pepe_grunts_9.mp3"),
  // ];


  // hurtIndex = Math.floor(Math.random() * this.pepe_hurt.length);
  // currentHurtAudio = this.pepe_hurt[this.hurtIndex];
  isPlayingHurtAudio = false;

  x = 0;
  y = 40;
  height = 340;
  width = 160;
  world;
  lastKeyPressTime = Date.now();
  isSleepingState = false;
  timeToSleep = 30000;
  keyboard;
  cameraX;
  speed = 20;
  speedY = 0;
  frameIndex = 0;

  offset = {
    left: 30,
    right: 40,
    top: 130,
    bottom: 40,
  };

  constructor(keyboard, timeToSleep) {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");
    this.keyboard = keyboard;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DYING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_SLEEPING);
    this.timeToSleep = timeToSleep;
    this.animateWalk();
    this.applyGravity();
    this.isPlayingHurtAudio = false;
    this.animateStates();
    this.listenForKeyPress();
 
  }

  animateWalk() {
    this.x = 100;

    setInterval(() => {
      if (this.energy > 0) {
        if (keyboard.RIGHT && this.x < this.world.level.level_endX) {
          
          this.moveRight();
        }
        if (keyboard.LEFT && this.x > 100) {
          this.moveLeft();
          this.otherDirection = true;
        }
        if ((keyboard.UP || keyboard.SPACE) && this.y >= 100) {
          this.jump();
        }
        this.world.cameraX = -this.x + 100;
      }
    }, 50);

  }

  listenForKeyPress() {
    document.addEventListener("keydown", () => {
      this.lastKeyPressTime = Date.now();
      if (this.isSleepingState) {
        this.stopSleepAnimation();
      }
    });
  }

    stopSleepAnimation() {
      this.isSleepingState = false;
      this.pepe_snore.pause();
    }

  animateStates() {
    setInterval(() => {
      if (this.isDead()) {
        this.animateDeath();
      } else if (this.isHurt()) {
        this.animateHurt();
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (Date.now() - this.lastKeyPressTime >= this.timeToSleep && !this.isSleepingState) {
        this.animateSleep();
      } else {
        this.animateWalking();
        this.stopSleepAnimation()
      }
    }, 200);
  }


  isSleeping() {
    setInterval(() => {
        if (Date.now() - this.lastKeyPressTime >= this.timeToSleep) { // Wenn 30 Sekunden lang keine Taste gedrückt wurde
            this.animateSleep();
        }
    }, 500); // Alle 500ms prüfen
}


animateSleep() {
  this.isSleepingState = true;
  
  this.playAnimation(this.IMAGES_SLEEPING);
  this.pepe_pollo.pause();
  this.pepe_snore.play();
  this.pepe_snore.volume = 0.3;
  this.pepe_snore.loop = true;
}




animateWalking() {
  if (this.isSleepingState) {
    this.stopSleepAnimation();
  }
  if (keyboard.RIGHT || keyboard.LEFT || keyboard.SPACE || keyboard.THROW) {
    this.playAnimation(this.IMAGES_WALKING);
  }
}


  animateDeath() {
    this.playAnimation(this.IMAGES_DYING);
  }

  animateJump() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  animateHurt() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_HURT);
      this.pepe_hurt.play();
      this.isPlayingHurtAudio = false;
      this.pepe_hurt.loop = false;
      if (!this.isPlayingHurtAudio) {
        this.pepe_hurt.currentTime = 0; // Zurücksetzen des Audio-Elements
        
        this.isPlayingHurtAudio = true;
      }
      this.pepe_hurt.volume = 0.5;
    }, 2000);
    this.pepe_hurt.pause();
  }

  // animateHurt(){
  //   //  this.pepe_hurt.pause();
  //   this.playAnimation(this.IMAGES_HURT);
  
  //   if (!this.isPlayingHurtAudio) {
  //     this.pepe_hurt.currentTime = 0; // Zurücksetzen des Audio-Elements
  //     this.pepe_hurt.play();
  //     this.isPlayingHurtAudio = true;
  //   }
  //   this.pepe_hurt.volume = 0.5;  
  // }



}

