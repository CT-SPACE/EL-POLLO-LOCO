class Pepe extends MovableObject {

  static GROUND_Y = 103;

x = 0; y = 40; height = 340; width = 160;

speedX = 20; speedY = 0; cameraX;

world; keyboard; audioManager;

animateDeathInterval; jumpInterval; lastKeyPressTime;
timeToSleep = 15000; timeToIdle = 800;

isSleeping = false; isDead = false;  isPlayingHurtAudio;

offset = { left: 40, right: 40, top: 130, bottom: 20 };
  

  /**
   * Defines the Pepe character with its properties and animations.
   * @param {Object} keyboard - The keyboard object for handling user input.
   * @param {Object} world - The world object that contains the game state and environment.
   */
  constructor(keyboard) {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");

    this.keyboard = keyboard;
    this.loadImages(PepeAssets.IMAGES_WALKING);
    this.loadImages(PepeAssets.IMAGES_JUMPING);
    this.loadImages(PepeAssets.IMAGES_DYING);
    this.loadImages(PepeAssets.IMAGES_HURT);
    this.loadImages(PepeAssets.IMAGES_IDLE);
    this.loadImages(PepeAssets.IMAGES_SLEEPING);
    this.audio = audioManager;
    this.animateWalk();
    this.applyGravity();
    this.lastKeyPressTime = Date.now();
    this.isPlayingHurtAudio = false;
    this.animateStates();
    this.isSleeping = false;
  }

  /**
 * Handles all walking and movement animations for Pepe
 */
animateWalk() {
  this.initializePosition();
  intervalsToStop(() => {
    if (this.energy <= 0) return;
    
    this.handleMovement();
    this.checkForJump();
    this.updateCamera();
  }, 1000 / 25);
}

/**
 * Sets Pepe's initial position
 */
initializePosition() {
  this.x = 100;
}

/**
 * Handles keyboard movement (left/right)
 */
handleMovement() {
  if (keyboard.RIGHT && this.x < this.world.level.level_endX) {
    this.handleRightMovement();
  }
  if (keyboard.LEFT && this.x > 100) {
    this.handleLeftMovement();
  }
}

/**
 * Checks if jump keys are pressed and Pepe is on the ground
 */
checkForJump() {
  if ((keyboard.UP || keyboard.SPACE) && this.isOnGround()) {
    this.animateJump();
  }
}

/**
 * Checks if Pepe is on the ground
 * @returns {boolean} - True if on ground
 */
isOnGround() {
  return this.y === Pepe.GROUND_Y;
}

/**
 * Updates the camera position relative to Pepe
 */
updateCamera() {
  this.world.cameraX = -this.x + 100;
}

/**
 * Sets the last key press time to the current time.
 * If the character is sleeping, it stops the sleep animation.
 */
 setLastKeyPressTime(){
          this.lastKeyPressTime = Date.now();
      if (this.isSleeping) {
        this.stopSleepAnimation();
      }
  }

  /**
   * In case of right movement, this function stopps the sleep animation, start the walking animation, and moves the character to the right.
   * It also plays the walking sound effect if not already playing.
   */
  handleRightMovement() {
    this.stopSleepAnimation();
    this.movementIsNotAboveGround();
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

  /**
   * In Case of Jumping, this function play the walking animation if the character is not above ground and not jumping.
   * This ensures that the walking animation is only played when the character is on the ground and not in the middle of a jump.
   */
  movementIsNotAboveGround(){
        if (!this.isAboveGround() && !this.isJumping)  this.playAnimation(PepeAssets.IMAGES_WALKING);
  }

  /**
   * Stopps the sleep animation and resets the isSleeping to false.
   * It also stops the audio playback for the sleeping sound effect.
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
 * Main animation state handler that determines which animation to play
 * based on Pepe's current state
 */
animateStates() {
  intervalsToStop(() => {
    const currentState = this.determineCurrentState();
    this.playAnimationForState(currentState);
  }, 721);
}

/**
 * Determines Pepe's current state based on various conditions
 * @returns {string} The current animation state
 */
determineCurrentState() {
  if (this.isZeroHealthscore()) return 'death';
  if (this.isHurt()) return 'hurt';
  if (this.isAboveGround()) return 'jumping';
  if (this.isInactiveUntilSleeping()) return 'sleeping';
  if (this.isInactiveUntilIdle()) return 'idle';
  return 'default';
}

/**
 * Checks if Pepe has been inactive for a long time (sleeping threshold)
 * @returns {boolean} True if inactive for long enough to sleep
 */
isInactiveUntilSleeping() {
  return Date.now() - this.lastKeyPressTime >= this.timeToSleep;
}

/**
 * Checks if Pepe has been inactive for a short time (idle threshold)
 * @returns {boolean} True if inactive for long enough to be idle
 */
isInactiveUntilIdle() {
  return Date.now() - this.lastKeyPressTime >= this.timeToIdle;
}

/**
 * Plays the appropriate animation based on the current state
 * @param {string} state - The current animation state
 */
playAnimationForState(state) {
  switch (state) {
    case 'death':
      this.animateDeath();
      break;
    case 'hurt':
      this.setLastKeyPressTime();
      this.animateHurt();
      break;
    case 'jumping':
      this.animateIsAboveGround();
      break;
    case 'sleeping':
      this.prepareForSleep();
      this.animateSleep();
      break;
    case 'idle':
      this.playAnimation(PepeAssets.IMAGES_IDLE);
      break;
    default:
      this.stopSleepAnimation();
      break;
  }
}

/**
 * Prepares Pepe for sleeping animation
 */
prepareForSleep() {
  this.isSleeping = true;
  this.isJumping = false;
}

/**
 * Main jump handler - initiates jump if allowed
 */
animateJump() {
  if (this.cannotJump()) return;
  this.prepareJump();
  this.startJumpAnimation();
}

/**
 * Checks if jumping is currently not possible
 * @returns {boolean} True if character cannot jump
 */
cannotJump() {
  if (this.isJumping) {
    return true;
  }
  return false;
}

/**
 * Prepares character state for jumping
 */
prepareJump() {
  this.isJumping = true;
  this.currentImage = 0;
  this.jump(); 
}

/**
 * Starts the jump animation sequence
 */
startJumpAnimation() {
  if (this.jumpInterval) clearInterval(this.jumpInterval);
  this.jumpInterval = setInterval(() => {
    this.playAnimation(PepeAssets.IMAGES_JUMPING);
    this.checkJumpAnimationComplete();
  }, 120);
}

/**
 * Checks if jump animation has completed
 */
checkJumpAnimationComplete() {
  if (this.currentImage >= PepeAssets.IMAGES_JUMPING.length) {
    clearInterval(this.jumpInterval);
    this.isJumping = false;
  }
}

/**
 * Animates Pete falling initially from to the ground and then plays the jumping animation.
 */
animateIsAboveGround() {
   if(localStorage.getItem("autostart")){
  this.animateIsFalling();
   };
  this.playAnimation(PepeAssets.IMAGES_JUMPING);
}

/**
 * Play the falling animation from above the screen to the ground.
 */
animateIsFalling(){
  this.y = -50;
  let fallSpeed = 5;
  let fallInterval = setInterval(() => {
    this.y += fallSpeed;
    if (fallSpeed < 12) fallSpeed += 0.5;
    if (this.y >= Pepe.GROUND_Y) {
      this.y = Pepe.GROUND_Y;
      clearInterval(fallInterval);
    }
  }, 1000 / 25);
}

  /**
   * Starts the sleeping animation by playing the sleeping images in a loop.
   * It also plays the snoring sound effect if not already playing.
   */
  animateSleep() {
    this.isSleeping = true;
    this.playAnimation(PepeAssets.IMAGES_SLEEPING);
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
    this.playAnimation(PepeAssets.IMAGES_DYING);
    if (this.moduloCurrentImage(PepeAssets.IMAGES_DYING) === PepeAssets.IMAGES_DYING.length - 1) {
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
 * Plays the hurt animation and sound for Pepe
 */
animateHurt() {
  this.playAnimation(PepeAssets.IMAGES_HURT);
  this.playHurtSound();
}

/**
 * Plays the hurt sound effect if not already playing
 */
playHurtSound() {
  if (!this.isPlayingHurtAudio) {
    this.isSleeping = false;
    this.isPlayingHurtAudio = true;
    this.audio.playAudio("pepe_hurt", {
      play: true,
      volume: 0.8,
      loop: false,
    });
    
    setTimeout(() => {
      this.isPlayingHurtAudio = false;
    }, 600);
  }
}
}
