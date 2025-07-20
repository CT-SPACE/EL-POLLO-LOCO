class Endboss extends MovableObject {
  height = 450;
  width = 380;
  speed = 0;
  speedY = 0.5;
  world;
  character;
  EndBossClose = false;
  deathHandled = false;
  energy = 100;
  status = false;
  isDead = false;

  y = 12;
  animationSpeed = 1000;
  animateWalkInterval;
  animateAttackInterval;
  animateAlertInterval;

  offset = {
    left: 60,
    right: 130,
    top: 100,
    bottom: 180,
  };
  static IMAGES_WALK = [
    "./img/4_enemie_boss_chicken/1_walk/G1.png",
    "./img/4_enemie_boss_chicken/1_walk/G2.png",
    "./img/4_enemie_boss_chicken/1_walk/G3.png",
    "./img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  static IMAGES_ALERT = [
    "./img/4_enemie_boss_chicken/2_alert/G5.png",
    "./img/4_enemie_boss_chicken/2_alert/G6.png",
    "./img/4_enemie_boss_chicken/2_alert/G7.png",
    "./img/4_enemie_boss_chicken/2_alert/G8.png",
    "./img/4_enemie_boss_chicken/2_alert/G9.png",
    "./img/4_enemie_boss_chicken/2_alert/G10.png",
    "./img/4_enemie_boss_chicken/2_alert/G11.png",
    "./img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  static IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  static IMAGES_HURT = [
    "./img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  static IMAGES_DEAD = [
    { src: "./img/4_enemie_boss_chicken/5_dead/G24.png", lastFrame: false },
    { src: "./img/4_enemie_boss_chicken/5_dead/G25.png", lastFrame: false },
    { src: "./img/4_enemie_boss_chicken/5_dead/G26.png", lastFrame: false },
    { src: "./img/4_enemie_boss_chicken/5_dead/G27.png", lastFrame: true },
  ];

  /**
   * Defines the properties of the Endboss class, including its position, speed, and dimensions.
   * Loads the images for walking, alert, attack, hurt, and dead states.
   * Initializes the endboss with a specific position and sets up animations. 
   * @param {Object} world 
   */
  constructor(world) {
    super().loadImage(Endboss.IMAGES_ALERT[0]);
    this.loadImages(Endboss.IMAGES_ALERT);
    this.loadImages(Endboss.IMAGES_WALK);
    this.loadImages(Endboss.IMAGES_ATTACK);
    this.loadImages(Endboss.IMAGES_HURT);
    this.loadImages(Endboss.IMAGES_DEAD);

    this.type = "endboss";
    this.world = world;
    this.EndBossClose = false;
    this.isDead = false;
    this.status = false;

    this.animateWalk();
    this.y = 12;
    this.x = 3800;
  }

  /**
   * Animates the endboss' walk.
   */
  animateWalk() {
    clearInterval(this.animateAttackInterval);
    clearInterval(this.animateAlertInterval);

    this.animateWalkInterval = setInterval(() => {
      this.speed = 0.8;
      this.playAnimation(Endboss.IMAGES_WALK);
      this.moveLeft(this.speed);
      if(this.EndBossClose){
         this.x -= 25;
         this.jump();
      }
    }, 6000 / 25);
  }

  /**
   * Starts the attack animation for the endboss.
   * @returns Prepares the endboss for an attack by stopping its walk animations,
   */
  animateAttack() {
    clearInterval(this.animateWalkInterval);
    clearInterval(this.animateAlertInterval);
    if (this.animateAttackInterval) clearInterval(this.animateAttackInterval);
     if (gamePaused) return;
    
    this.animateAttackInterval = setInterval(() => {
     let jumpDistance = 40;
      this.playAnimation(Endboss.IMAGES_ATTACK);
      if (this.currentImage % Endboss.IMAGES_ATTACK.length === 5) {
        this.x -= jumpDistance;
      }
    }, 2000 / 25);
  }

  /**
   * Handles the death animation of the endboss.
   * Stops the background music and plays the death animation.
   * If the endboss is dead, it clears the death animation interval and triggers the game over state.
   */
  animateDeath() {
    audioManager.controlAudio("endbossBackground", { play: false, pause: true });
    if (!this.deathHandled) {
      this.deathHandled = true;
      this.isDead = true;
      this.currentImage = 0;
      gamePaused = true;
      keyboardEnabled = false;;
      this.animateDeathInterval = setInterval(() => {
        this.playAnimation(Endboss.IMAGES_DEAD);
        if (this.moduloCurrentImage(Endboss.IMAGES_DEAD) === Endboss.IMAGES_DEAD.length - 1) {
          clearInterval(this.animateDeathInterval);
          this.world.handleGameOver("Endboss");
        }
      }, 100);
    }
  }

  /**
   * Helper function to calculate the current image index based on the modulo operation.
   * This is used to loop through the images in the animation.
   * @returns The current image index based on the modulo operation.
   * @param {Array} images - The array of images to loop through.
   */
  moduloCurrentImage(images) {
    let i = this.currentImage % images.length;
    return i;
  }

  /**
   * Indictes whether the endboss is attacking or not.
   * This function plays the attack sound if the status is true, and stops it if false.
   * @param {Boolean} status 
   * @returns 
   */
  isAttacking(status) {
    if (status === true) {
      audioManager.playAudio("endboss_attack", { play: true });
      return true;
    } else {
      audioManager.controlAudio("endboss_attack", {
        play: false,
        pause: true,
        currentTime: 0,
      });
      return false;
    }
  }

  /**
   * Checks if there is a reason to change to the attack state.
   */
  startAttackMode() {
    this.status = true;
    this.isAttacking(this.status);
    if (this.animateAttackInterval) clearInterval(this.animateAttackInterval);
    this.animateAttack();
  }

  /**
   * In case of loosing to much energy by beeing hit by bottles, the endboss plays the hurt animation.
   * It stops the attack and walk animations, and plays the hurt animation.
   * If the endboss is dead, it stops the hurt animation.
   */
  animateHurt() {
    clearInterval(this.animateAttackInterval);
    clearInterval(this.animateWalkInterval);
    clearInterval(this.animateAlertInterval);

    if (this.animateHurtInterval) clearInterval(this.animateHurtInterval);
      let hurtFrame = 0;
      this.animateHurtInterval = setInterval(() => {
        if (this.isDead) {
          clearInterval(this.animateHurtInterval);
          return;
        }
      this.img = imgCache[Endboss.IMAGES_HURT[hurtFrame]];
      hurtFrame = (hurtFrame + 1) % Endboss.IMAGES_HURT.length;
    }, 500);
  }



/** Helper function to check if the endboss has zero energy.
 *  If so, it triggers the endboss death animation.
 */
hitEndbossZero(){
    if (this.energy <= 0 && !this.isDead) {
        this.animateEndbossDeath();
        return;
    }
}

/**
 * Helper function to check if the endboss has less or more than twenty energy.
 * If so, it triggers the endboss hurt animation or starts the endboss attack mode.
 */
hitEndbossLessOrMoreThanTwenty(){
    if (this.energy <= 20 && !this.isDead) {
        this.animateEndbossHurt();
    } else if (this.energy > 20 && !this.isDead) {
        this.startEndbossAttackMode();
    }
}

/**
 * Helper function for calculation of endboss energy
 * @param {number} amount 
 */
  reduceEndbossEnergy(amount) {
    this.energy = Math.max(0, this.energy - amount);
}
/**
 * Helper function for update values to the statusbar
 */
  updateEndbossStatusBar() {
    if (typeof this.world.statusBarEndboss?.setPercentage === "function") {
        this.world.statusBarEndboss.setPercentage(this.energy);
    }
}
/**
 * Helper function for Endboss Death animation
 */
  animateEndbossDeath() {
    if (typeof this.animateDeath === "function") {
        this.animateDeath();
    }
}

/**
 * Helper function for endboss hurt animation.
 */
  animateEndbossHurt() {
    if (typeof this.animateHurt === "function") {
        this.animateHurt();
    }
}

/**
 * Helper function to start the endboss attack mode
 */
  startEndbossAttackMode() {
    if (typeof this.startAttackMode === "function") {
        this.startAttackMode();
    }
}


}
