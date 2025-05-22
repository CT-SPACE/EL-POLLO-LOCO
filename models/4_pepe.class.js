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


  isPlayingHurtAudio = false;

  x = 0;
  y = 40;
  height = 340;
  width = 160;
  world;
  audio;
  lastKeyPressTime = Date.now();
  isSleepingState = false;
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
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DYING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_SLEEPING);
    this.audio = audio;
    this.animateWalk();
    this.applyGravity();
    this.listenForKeyPress(this.lastKeyPressTime);
    this.isPlayingHurtAudio = false;
    this.animateStates();
  }
  

  animateWalk() {
    this.x = 100;

    setInterval(() => {
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
          this.playAnimation(this.IMAGES_WALKING);
          this.moveRight();
          if (!this.audio.audioPlaying["pepe_pollo"]) {
            // this.audio.audioPlaying["pepe_pollo"] = true;
             this.audio.playAudio("pepe_pollo", { loop: false, volume: 0.4 });
           
        }
  }

  handleLeftMovement(){
          this.stopSleepAnimation();
          this.playAnimation(this.IMAGES_WALKING);
          this.moveLeft(this.speed);
          this.otherDirection = true;
  }

  stopSleepAnimation() {
    this.isSleepingState = false;

    audio.controlAudio("pepe_snore", {
      play: false,
      pause: true,
      currentTime: 0,
    });

  }

  animateStates() {
    this.isPlayingHurtAudio = false;

    setInterval(() => {
      if (this.isDead()) {
        this.animateDeath();
      } else if (this.isHurt()) {
        this.animateHurt();
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);

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

    this.playAnimation(this.IMAGES_SLEEPING);
    if (!audioPlaying["pepe_snore"]) {
      audio.playAudio("pepe_snore", { loop: true, volume: 0.4 });
      audioPlaying["pepe_snore"] = true;
    }
    audio.controlAudio("pepe_pollo", { play:false, pause: true, currentTime: 0 });

  }

  animateDeath() {
    this.playAnimation(this.IMAGES_DYING);
    audio.controlAudio("pepe_snore", { pause: true, currentTime: 0 });

  }

  animateJump() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  animateHurt() {
    this.playAnimation(this.IMAGES_HURT);

    if (!this.isPlayingHurtAudio) {
      audio.playAudio("pepe_hurt", { play: true, volume: 0.5, loop: false });

    }
  }
}
