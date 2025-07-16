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
    "./img/2_character_pepe/3_jump/J-31_.png",
    "./img/2_character_pepe/3_jump/J-32_.png",
    "./img/2_character_pepe/3_jump/J-33_.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37_.png",
    "./img/2_character_pepe/3_jump/J-38_.png",
    "./img/2_character_pepe/3_jump/J-39_.png",
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

  static IMAGES_IDLE = [
    "./img/2_character_pepe/1_idle/idle/I-1.png",
    "./img/2_character_pepe/1_idle/idle/I-2.png",
    "./img/2_character_pepe/1_idle/idle/I-3.png",
    "./img/2_character_pepe/1_idle/idle/I-4.png",
    "./img/2_character_pepe/1_idle/idle/I-5.png",
    "./img/2_character_pepe/1_idle/idle/I-6.png",
    "./img/2_character_pepe/1_idle/idle/I-7.png",
    "./img/2_character_pepe/1_idle/idle/I-8.png",
    "./img/2_character_pepe/1_idle/idle/I-9.png",
    "./img/2_character_pepe/1_idle/idle/I-10.png",
  ];

//   static IMAGES_JUMPING_PREP = [
//   "./img/2_character_pepe/3_jump/J-31.png",
//   "./img/2_character_pepe/3_jump/J-32.png",
//   "./img/2_character_pepe/3_jump/J-33.png",

// ];

// static IMAGES_JUMPING_AIR = [
//     "./img/2_character_pepe/3_jump/J-34.png",
//   "./img/2_character_pepe/3_jump/J-35.png",
//   "./img/2_character_pepe/3_jump/J-36.png",

// ];

// static IMAGES_JUMPING_LAND = [
//     "./img/2_character_pepe/3_jump/J-37.png" ,
//   "./img/2_character_pepe/3_jump/J-38.png",
//   "./img/2_character_pepe/3_jump/J-39.png"
// ];

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
  deathHandled = false;
  animateWalkInterval;
  animateDeathInterval;
  timeToSleep = 15000;
  timeToIdle = 2000;
  keyboard;
  cameraX;
  speed = 20;
  speedY = 0;
  frameIndex = 0;
  alreadyJumped = false;
  jumpIntervalAlreadyRunning = false;
  offset = {
    left: 40,
    right: 40,
    top: 130,
    bottom: 20,
  };

  /**
   * Defines the Pepe character with its properties and animations.
   * Initializes the character's position, speed, and animations.
   * @param {Object} keyboard - The keyboard object for handling user input.
   * @param {Object} world - The world object that contains the game state and environment.
   */
  constructor(keyboard) {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");

    this.keyboard = keyboard;
    this.loadImages(Pepe.IMAGES_WALKING);
    this.loadImages(Pepe.IMAGES_JUMPING);
    this.loadImages(Pepe.IMAGES_DYING);
    this.loadImages(Pepe.IMAGES_HURT);
    this.loadImages(Pepe.IMAGES_IDLE);
    this.loadImages(Pepe.IMAGES_SLEEPING);
    this.audio = audioManager;
    this.animateWalk();
    this.applyGravity();
    this.listenForKeyPress(this.lastKeyPressTime);
    this.isPlayingHurtAudio = false;
    this.animateStates();
  }

  /**
   * 
   */
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
    }, 2000 / 25);
  }

  /**
   * Handles the jump action for the Pepe character.
   * It sets the speedY to a negative value to simulate jumping and plays the jump animation. 
   * @param {Number} lastKeyPressTime 
   */
  listenForKeyPress(lastKeyPressTime) {
    this.lastKeyPressTime = lastKeyPressTime;
    document.addEventListener("keydown", () => {
      this.lastKeyPressTime = Date.now();
      if (this.isSleepingState) {
        this.stopSleepAnimation();
      }
    });
  }

  /**
   * In case of right movement, this function stopps the sleep animation, start the walking animation, and moves the character to the right.
   * It also plays the walking sound effect if not already playing.
   */
  handleRightMovement() {
    this.stopSleepAnimation();

     if (!this.isAboveGround()) {
    this.playAnimation(Pepe.IMAGES_WALKING);
  }
    this.moveRight();
    if (!this.audio.audioPlaying["pepe_pollo"]) {
      this.audio.playAudio("pepe_pollo", { loop: false, volume: 0.4 });
    }
  }

  /**
   * In case of left movement, this function stopps the sleep animation, start the walking animation, and moves the character to the left.
  * It sets the otherDirection to true to flip the character's direction.
  */
  handleLeftMovement() {
    this.stopSleepAnimation();
      if (!this.isAboveGround()) {
    this.playAnimation(Pepe.IMAGES_WALKING);
  }
    this.moveLeft(this.speed);
    this.otherDirection = true;
  }

  /**
   * Stopps the sleep animation and resets the isSleepingState to false.
   * It also stops the audio playback for the sleeping sound effect.
   * This function is called when the character is no longer in a sleeping state.
   */
  stopSleepAnimation() {
    this.isSleepingState = false;
    this.audio.controlAudio("pepe_snore", {
      play: false,
      pause: true,
      currentTime: 0,
    });
  }

  /**
   * This function handles all states of Pepe animation, like walking, jumping, sleeping, and dying.
   */
  animateStates() {
    this.isPlayingHurtAudio = false;
    setInterval(() => {
      if (this.isZeroHealthscore()) {
        this.animateDeath();
      } else if (this.isHurt()) {
        this.lastKeyPressTime = Date.now();
        this.animateHurt();
      } else if (this.isAboveGround()) {
        this.playAnimation(Pepe.IMAGES_JUMPING);
      } else if (Date.now() - this.lastKeyPressTime >= this.timeToSleep) {
        this.isSleepingState = true;
        this.animateSleep();
      } else if (Date.now() - this.lastKeyPressTime >= this.timeToIdle) {
        this.playAnimation(Pepe.IMAGES_IDLE);
      } else {
        this.stopSleepAnimation();
      }
    }, 300);
  }

  // animateStates() {
  //   this.isPlayingHurtAudio = false;
  //   setInterval(() => {
  //     if (this.isZeroHealthscore()) {
  //       this.animateDeath();
  //     } else if (this.isHurt()) {
  //       this.lastKeyPressTime = Date.now();
  //       this.animateHurt();
  //     } else if (this.alreadyJumped && !this.jumpIntervalAlreadyRunning) {
  //       this.jumpIntervalAlreadyRunning = true;
  //       this.startJump();
  //     } else if (Date.now() - this.lastKeyPressTime >= this.timeToSleep) {
  //       this.isSleepingState = true;
  //       this.animateSleep();
  //     } else if (Date.now() - this.lastKeyPressTime >= this.timeToIdle) {
  //       this.playAnimation(Pepe.IMAGES_IDLE);
  //     } else {
  //       this.stopSleepAnimation();
  //     }
  //   }, 200);
  // }

  /**
   * Starts the jump animation with a defined Time Interval.
   * It plays the jumping images in a loop and resets the jump state after a defined duration.
   */
   startJump(){
    this.currentImage = 0;
    let jumpInterval = setInterval(() =>{
      this.playAnimation(Pepe.IMAGES_JUMPING);
      console.log("JUMGING", Date.now(), this.moduloCurrentImage(Pepe.IMAGES_JUMPING));
    }, 50);
    setTimeout(() =>{
      clearInterval(jumpInterval);
      this.jumpIntervalAlreadyRunning = false;
      this.alreadyJumped = false;
    }, 1442);
  }

  /**
   * Starts the sleeping animation by playing the sleeping images in a loop.
   * It also plays the snoring sound effect if not already playing.
   * If the character is already in a sleeping state, it does nothing.
   */
  animateSleep() {
    this.isSleepingState = true;
    this.playAnimation(Pepe.IMAGES_SLEEPING);
    if (!this.audio.audioPlaying["pepe_snore"]) {
      this.audio.playAudio("pepe_snore", { loop: true, volume: 0.4 });
      this.audio.audioPlaying["pepe_snore"] = true;
    }
    this.audio.controlAudio("pepe_pollo", {
      play: false,
      pause: true,
      currentTime: 0,
    });
  }

  /**
   * Handles the death animation of Pepe.
   * It stops the walking animation, plays the death image, and removes Pepe from the world after a delay.
   * If Pepe is already dead, it does nothing.
   */
  animateDeath() {
    if (!this.deathHandled) {
      this.deathHandled = true;
      this.isDead = true;
      this.currentImage = 0;
      gamePaused = true;
      keyboardEnabled = false;
      this.animateDeathInterval = setInterval(() => {
        this.intervalSettingForAnimateDeath();
      }, 100);
    }
  }

  /**
   * Helper function to handle the death animation of Pepe.
   */
  intervalSettingForAnimateDeath() {
    this.playAnimation(Pepe.IMAGES_DYING);
    if (
      this.moduloCurrentImage(Pepe.IMAGES_DYING) ===
      Pepe.IMAGES_DYING.length - 1
    ) {
      clearInterval(this.animateDeathInterval);
      this.world.handleGameOver("Pepe");
    }
  }

  /**
   * Helper function to calculate the current image index based on the modulo operation.
   * @param {Array} images 
   * @returns 
   */
  moduloCurrentImage(images) {
    let i = this.currentImage % images.length;
    return i;
  }

  /**
   * Helper function to play the jump animation.
   */
  animateJump() {
    this.playAnimation(Pepe.IMAGES_JUMPING);
  }

  /**
   * Helper function calls the playAnimation function for the hurt images.
   * It also plays the hurt sound effect if not already playing.
   */
  animateHurt() {
    this.playAnimation(Pepe.IMAGES_HURT);

    if (!this.isPlayingHurtAudio) {
      this.audio.playAudio("pepe_hurt", {
        play: true,
        volume: 0.5,
        loop: false,
      });
    }
  }
}