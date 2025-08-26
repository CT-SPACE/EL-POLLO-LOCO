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

  static IMAGES_JUMPING_UP = [
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
  ]
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

  static GROUND_Y = 103;

  isPlayingHurtAudio;

  x = 0;
  y = 40;
  height = 340;
  width = 160;
  world;
  audioManager;
  animateDeathInterval;
  jumpInterval;
  lastKeyPressTime;
  isSleeping = false;
  isDead = false;
  timeToSleep = 15000;
  timeToIdle = 800;
  keyboard;
  cameraX;
  speedX = 20;
  speedY = 0;
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
    this.lastKeyPressTime = Date.now();
    // this.listenForKeyPress();
    this.isPlayingHurtAudio = false;
    this.animateStates();
    // this.isJumping = false;
    this.isSleeping = false;

  //     document.addEventListener("keydown", () => {
  //   this.lastKeyPressTime = Date.now();
  //   if (this.isSleeping) {
  //     this.stopSleepAnimation();
  //   }
  // })
  }

  /**
   *
   */
  animateWalk() {
    this.x = 100;
    intervalsToStop(() => {
      if (this.energy <= 0) return;
      if (keyboard.RIGHT && this.x < this.world.level.level_endX) {
        this.handleRightMovement();
      }
      if (keyboard.LEFT && this.x > 100) {
        this.handleLeftMovement();
      }
      if ((keyboard.UP || keyboard.SPACE) && this.y === 103) {

        console.log("animateWalk:vor UP or SPACE", keyboard.UP, keyboard.SPACE, this.y);
        this.animateJump();
        console.log("animateWalk:nach UP or SPACE", keyboard.UP, keyboard.SPACE, this.y);

      }
      this.world.cameraX = -this.x + 100;
    }, 1000 / 25);
  }

  /**
   * Handles the Sleeping state of the character after isSleepingTime is reached.
   * @param {Number} lastKeyPressTime
   */
  // listenForKeyPress() {
  //   document.addEventListener("keydown", this.setLastKeyPressTime());
  // }

 setLastKeyPressTime(){
          this.lastKeyPressTime = Date.now();
      if (this.isSleeping) {
        this.stopSleepAnimation();
      }
  }

//   listenForKeyPress(lastKeyPressTime) {
//   this.lastKeyPressTime = lastKeyPressTime;
//   if (!this._keyListenerSet) {
//     document.addEventListener("keydown", this._handleKeyDown.bind(this));
//     this._keyListenerSet = true;
//   }
// }

// _handleKeyDown() {
//   this.lastKeyPressTime = Date.now();
//   if (this.isSleeping) {
//     this.stopSleepAnimation();
//   }
// }

  /**
   * In case of right movement, this function stopps the sleep animation, start the walking animation, and moves the character to the right.
   * It also plays the walking sound effect if not already playing.
   */
  handleRightMovement() {
    this.stopSleepAnimation();
    this.movementIsNotAboveGround();
    // if (!this.isAboveGround()) {
    //   this.playAnimation(Pepe.IMAGES_WALKING);
    // }
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
    this.movementIsNotAboveGround();
    this.moveLeft(this.speedX);
    this.otherDirection = true;
  }

  movementIsNotAboveGround(){
        if (!this.isAboveGround() && !this.isJumping)  this.playAnimation(Pepe.IMAGES_WALKING);
  
  }

  /**
   * Stopps the sleep animation and resets the isSleeping to false.
   * It also stops the audio playback for the sleeping sound effect.
   * This function is called when the character is no longer in a sleeping state.
   */
  stopSleepAnimation() {
    this.isSleeping = false;
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
    intervalsToStop(() => {
      if (this.isZeroHealthscore()) {
        this.animateDeath();
      } else if (this.isHurt()) {
        this.lastKeyPressTime = Date.now();
        this.animateHurt();
      } else if (this.isAboveGround()) {
        console.log("animateSTates: isAboveGround");
       this.animateIsAboveGround();
        // this.playAnimation(Pepe.IMAGES_JUMPING);
        // this.animateJump();
      } else if (Date.now() - this.lastKeyPressTime >= this.timeToSleep) {
        this.isSleeping = true;
        this.isJumping = false;
        this.animateSleep();
      } else if (Date.now() - this.lastKeyPressTime >= this.timeToIdle) {
        this.playAnimation(Pepe.IMAGES_IDLE);
      } else {
        this.stopSleepAnimation();

      }
    },721);
  }

  /**
   * Starts the jump animation with a defined Time Interval.
   * It plays the jumping images in a loop and resets the jump state after a defined duration.
   */
  // animateJump() {
  //   this.jump();
  //   this.currentImage = 0;
  //   this.playAnimation(Pepe.IMAGES_JUMPING);
  // }

  //   animateJump() {
  //     this.isSleeping = false;
  //   if (this.isJumping) return; 
  //   this.isJumping = true;
  //   this.currentImage = 0;
  //   this.playAnimation(Pepe.IMAGES_JUMPING);
  // }

animateJump() {
  // if (this.isJumping) return;
  this.isJumping = true;
  this.currentImage = 0;
   this.jump(); // Nur einmal beim Sprungstart!
  if (this.jumpInterval) clearInterval(this.jumpInterval);
  this.jumpInterval = setInterval(() => {

    this.playAnimation(Pepe.IMAGES_JUMPING);
    if (this.currentImage >= Pepe.IMAGES_JUMPING.length) {
      clearInterval(this.jumpInterval);
      this.isJumping = false;
      // this.y = Pepe.GROUND_Y;
      // this.speedY = 0;
    }
  }, 120);
}

// playPepeJumpAnimation(images) {
//   this.images = images;
//   let i = this.moduloCurrentImage(this.images) ;
//   let frame = this.images[i];
//   let path = typeof frame === "string" ? frame : frame.src;

//     //  if(i === 0) this.jump(); // SpeedY auf 34 setzen

//   this.img = imgCache[path];
//   this.currentImage++;
// }


//   animateJump2() {
//   this.jump(); // Startimpuls
//   this.currentImage = 0;
//   let jumpFrames = this.moduloCurrentImage(Pepe.IMAGES_JUMPING) || 0;

//   const jumpInterval = setInterval(() => {
//     // Bild setzen
//     this.img = imgCache[Pepe.IMAGES_JUMPING[jumpFrames]];

//     // y-Wert je nach Phase
//     if (jumpFrames < 3 || jumpFrames > 5) {
//       console.log("animateJump2: <3 & 5< jumpFrames:", jumpFrames);
//       this.y = 103; // Bodenphase
//     } else {
     
//       this.y = 103 - 3 * Math.pow(jumpFrames - 4, 2); // Sprungphase 
//       console.log("animateJump2: else jumpFrames:", jumpFrames, "y:", this.y);
//     }

//     this.currentImage++;
//     jumpFrames++;
//     console.log("animateJump2: jumpFrames++:", jumpFrames, "currentImage:", this.currentImage);
//     if (jumpFrames > 8) {
//       clearInterval(jumpInterval);
//       this.y = 103; // Sicherheit: Bodenwert setzen
//     }
//   }, 80);
// }


animateIsAboveGround() {
   if(localStorage.getItem("autostart")){
  this.animateIsFalling();
   };
  this.playAnimation(Pepe.IMAGES_JUMPING);
}

animateIsFalling(){
  this.y = -50; // Startposition weit oben
  let fallSpeed = 5;
  const fallInterval = setInterval(() => {
    this.y += fallSpeed;
    if (fallSpeed < 12) fallSpeed += 0.5;
    if (this.y >= Pepe.GROUND_Y) {
      this.y = Pepe.GROUND_Y; // Bodenposition
      clearInterval(fallInterval);
    }
  }, 1000 / 25);
}





//     animateJump() {
//       console.log("animateJump: Start");
// const frames = Pepe.IMAGES_JUMPING.length; // z.B. 8
// for (let frame = 0; frame < frames; frame++) {
//   this.y = this.getJumpY(frame, frames);
//   this.playAnimation(Pepe.IMAGES_JUMPING[frame]);
// }
//   }


// getJumpY(frame, frames) {

// const baseY = 103; // Bodenhöhe
// const jumpHeight = 173; // maximale Sprunghöhe (positiv!)
// const h = (frames - 1) / 2; // Scheitelpunkt (Mitte)
// const a = jumpHeight / (h * h); // Parabel-Parameter
// frame = frame % frames; // Sicherstellen, dass frame im Bereich von 0 bis frames-1 bleibt
//   console.log("getJumpY(): frame: ", frame, frames, h,a, "return-Value:", (baseY - (-a * Math.pow(frame - h, 2) + jumpHeight)));
//   return baseY - (-a * Math.pow(frame - h, 2) + jumpHeight);
// }

  /**
   * Starts the sleeping animation by playing the sleeping images in a loop.
   * It also plays the snoring sound effect if not already playing.
   * If the character is already in a sleeping state, it does nothing.
   */
  animateSleep() {
    this.isSleeping = true;
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
    if (!this.isDead) {
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
    if (this.moduloCurrentImage(Pepe.IMAGES_DYING) === Pepe.IMAGES_DYING.length - 1) {
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
   * Helper function calls the playAnimation function for the hurt images.
   * It also plays the hurt sound effect if not already playing.
   */
  animateHurt() {
    this.playAnimation(Pepe.IMAGES_HURT);

    if (!this.isPlayingHurtAudio) {
      this.isSleeping = false;
      this.isPlayingHurtAudio = true;
      this.audio.playAudio("pepe_hurt", {
        play: true,
        volume: 0.5,
        loop: false,
      });
    }
  }
}
